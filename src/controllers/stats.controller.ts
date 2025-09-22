import { Request, Response, NextFunction } from 'express';
import { Cafe } from '../models/Cafe';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { Plan } from '../models/Plan';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const TotalCafe = await Cafe.countDocuments();
        const TotalSubscriptions = await Plan.countDocuments({ status: 'active' });
        const ActiveOrders = await Order.countDocuments({ status: 'active' });

        // Calculate monthly revenue
        const currentDate = new Date();
        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Get revenue data for last 6 months
        const monthlyRevenueData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 6))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    value: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartData = monthlyRevenueData.map(item => ({
            name: months[item._id.month - 1],
            value: item.value
        }));

        // Get plan distribution
        const planDistribution = await Plan.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            }
        ]);

        const colors = {
            'Free': '#DC2626',
            'Premium': '#10B981'
        };

        const totalPlans = planDistribution.reduce((acc, curr) => acc + curr.count, 0);
        const pieData = planDistribution.map(item => ({
            name: item._id,
            value: Math.round((item.count / totalPlans) * 100),
            color: colors[item.name as 'Free' | 'Premium']
        }));

        res.status(200).json({
            success: true,
            totalCafes: TotalCafe,
            totalSubscriptions: TotalSubscriptions,
            activeOrders: ActiveOrders,
            monthlyRevenue: monthlyRevenue[0]?.total || 0,
            chartData,
            pieData
        });
    } catch (error) {
        next(error);
    }
};

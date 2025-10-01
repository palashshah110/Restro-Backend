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

export const getCafeStats = async (req: any, res: Response, next: NextFunction) => {
  try {
    const Order = req.orders;
    const Menu = req.menu;

    // 1️⃣ Total orders
    const totalOrders = await Order.countDocuments();

    // 2️⃣ Total menu items
    const totalMenu = await Menu.countDocuments();

    // 3️⃣ Active orders
    const activeOrders = await Order.countDocuments({ status: "active" });

    // 4️⃣ Monthly revenue (current month)
    const now = new Date();
    const monthlyRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;

    // 5️⃣ Chart data → last 6 months revenue
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1); // last 6 months
    const monthlyRevenueData = await Order.aggregate([
      {
        $match: { createdAt: { $gte: sixMonthsAgo } },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const chartData = monthlyRevenueData.map((item:any) => ({
      name: months[item._id.month - 1],
      value: item.total,
    }));

    // 6️⃣ Pie data → order distribution by most ordered menu items
    // We'll sum quantities of each menu item across all orders
    const orderDistributionAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.itemId",
          count: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "menus", // the tenant menu collection
          localField: "_id",
          foreignField: "_id",
          as: "menu",
        },
      },
      { $unwind: "$menu" },
      { $sort: { count: -1 } },
      { $limit: 5 }, // top 5 most ordered items
    ]);

    const colors = ["#3B82F6","#10B981","#F59E0B","#8B5CF6","#F87171"];

    const pieData = orderDistributionAgg.map((item:any, index:number) => ({
      name: item.menu.itemName,
      value: item.count,
      color: colors[index] || "#000000",
    }));

    res.status(200).json({
      success: true,
      totalOrders,
      totalMenu,
      activeOrders,
      monthlyRevenue,
      chartData,
      pieData,
    });
  } catch (error) {
    next(error);
  }
};

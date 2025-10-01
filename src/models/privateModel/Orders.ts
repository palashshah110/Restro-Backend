import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    tableNo: number;
    menuId: mongoose.Schema.Types.ObjectId;
    amount: number;
    status: 'Ordered' | 'Preparing' | 'Delivered' | 'Cancelled';
}
const OrderSchema = new Schema<IOrder>({
    tableNo: {
        type: Number,
    },
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    status: {
        type: String,
        enum: ['Ordered', 'Preparing', 'Delivered', 'Cancelled'],
        default: 'Ordered',
        required: true
    }
}, { versionKey: false, timestamps: true });

// Indexes
OrderSchema.index({ status: 1 });

export default OrderSchema

import mongoose, { Schema, Document } from 'mongoose';
import { Booking } from '../types';

interface IBookingModel extends Omit<Booking, '_id'>, Document {}

const BookingSchema = new Schema<IBookingModel>({
  roomId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
}, { timestamps: true });

export const BookingModel = mongoose.model<IBookingModel>('Booking', BookingSchema);
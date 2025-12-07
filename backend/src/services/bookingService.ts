import { BookingModel } from '../models/Booking';
import { CreateBookingSchema } from '../types';
import { z } from 'zod';

type BookingRequest = z.infer<typeof CreateBookingSchema>;

export class BookingService {
  static async createBooking(userId: string, data: BookingRequest) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    const now = new Date();

    if (start >= end) throw new Error("Start time must be before end time");
    if (start < now) throw new Error("Cannot book dates in the past");

    // Conflict Check
    const conflict = await BookingModel.findOne({
      roomId: data.roomId,
      status: 'active',
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }]
    });

    if (conflict) {
      return { conflict: true, message: "Room booked", conflictingBookings: [conflict] };
    }

    return await BookingModel.create({
      userId,
      roomId: data.roomId,
      startTime: start,
      endTime: end,
      status: 'active'
    });
  }
}
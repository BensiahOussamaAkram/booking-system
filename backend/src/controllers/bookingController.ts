import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { BookingService } from '../services/bookingService';
import { BookingModel } from '../models/Booking';
import { broadcast } from '../utils/sse';

export class BookingController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const result = await BookingService.createBooking(req.user!.userId, req.body);
      
      if ('conflict' in result) return res.status(409).json(result);

      broadcast('booking-created', { bookingId: result._id, roomId: result.roomId });
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getAvailability(req: AuthRequest, res: Response) {
    const { date, roomId } = req.query;
    if (!date || !roomId) return res.status(400).send("Missing params");

    const dayStart = new Date(date as string);
    dayStart.setHours(8, 0, 0, 0);
    const dayEnd = new Date(date as string);
    dayEnd.setHours(18, 0, 0, 0);

    const bookings = await BookingModel.find({
      roomId,
      status: 'active',
      startTime: { $lt: dayEnd },
      endTime: { $gt: dayStart }
    }).sort({ startTime: 1 });

    const availableSlots = [];
    let pointer = dayStart;

    for (const b of bookings) {
      if (pointer < b.startTime) {
        availableSlots.push({ start: pointer.toISOString(), end: b.startTime.toISOString() });
      }
      pointer = b.endTime > pointer ? b.endTime : pointer;
    }
    
    if (pointer < dayEnd) {
      availableSlots.push({ start: pointer.toISOString(), end: dayEnd.toISOString() });
    }

    return res.json({ roomId, availableSlots });
  }

  static async reschedule(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { startTime, endTime } = req.body;
      
      const result = await BookingService.rescheduleBooking(id, req.user!.userId, startTime, endTime);

      if ('conflict' in result) return res.status(409).json(result);

      broadcast('booking-rescheduled', { bookingId: result._id, roomId: result.roomId });
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getAllAdmin(req: AuthRequest, res: Response) {
    const report = await BookingService.getAllBookingsGrouped();
    res.json(report);
  }
}
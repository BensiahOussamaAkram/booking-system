import { z } from 'zod';

export const CreateBookingSchema = z.object({
  roomId: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export interface Booking {
  _id: string;
  roomId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'cancelled';
}
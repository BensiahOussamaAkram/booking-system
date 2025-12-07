import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { sseHandler } from './utils/sse';
import { BookingController } from './controllers/bookingController';
import { authenticateToken } from './middleware/auth';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.post('/auth/login', (req, res) => {
  const token = jwt.sign({ userId: 'user1', role: 'user' }, 'secret');
  res.json({ token, user: { id: 'user1', role: 'user' } });
});

app.get('/bookings/stream', sseHandler);
app.post('/bookings', authenticateToken, BookingController.create);
app.get('/rooms/availability', authenticateToken, BookingController.getAvailability);
app.patch('/bookings/:id/reschedule', authenticateToken, BookingController.reschedule);
app.get('/admin/bookings', authenticateToken, BookingController.getAllAdmin);

mongoose.connect('mongodb://localhost:27017/booking-test')
  .then(() => app.listen(3000, () => console.log('Backend running on 3000')));


 
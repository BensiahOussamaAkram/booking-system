import axios from 'axios';

export const API = axios.create({ baseURL: 'http://localhost:3000' });

export const createBooking = async (token: string, data: any) => {
  return API.post('/bookings', data, { headers: { Authorization: `Bearer ${token}` } });
};

export const fetchAvailability = async (token: string, roomId: string, date: string) => {
  const { data } = await API.get('/rooms/availability', {
    params: { roomId, date },
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};
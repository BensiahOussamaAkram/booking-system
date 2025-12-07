import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoomAvailability } from './components/RoomAvailability'; // (Code provided in previous turn)
import { CreateBookingForm } from './components/CreateBookingForm';
import { useRealTimeBookings } from './hooks/useRealTime';
import { useState } from 'react';

const queryClient = new QueryClient();

const Dashboard = () => {
  useRealTimeBookings();
  const [token, setToken] = useState('');

  if (!token) return <button onClick={() => fetch('http://localhost:3000/auth/login', { method: 'POST' }).then(r => r.json()).then(d => setToken(d.token))}>Login</button>;

  return (
    <div style={{ padding: 20 }}>
      <RoomAvailability token={token} roomId="room_1" />
      <CreateBookingForm token={token} roomId="room_1" />
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
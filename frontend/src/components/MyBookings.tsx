import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../api';

export const MyBookings = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  const [rescheduleTarget, setRescheduleTarget] = useState<string | null>(null);
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');

  // 1. Fetch My Bookings
  const { data: bookings } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await API.get('/bookings/me', { headers: { Authorization: `Bearer ${token}` } }); 
      // Note: You need to implement GET /bookings/me in backend if not already there, 
      // or just filter client-side for this demo.
      return res.data;
    }
  });

  // 2. Reschedule Mutation
  const mutation = useMutation({
    mutationFn: async () => {
      return API.patch(`/bookings/${rescheduleTarget}/reschedule`, 
        { startTime: new Date(newStart), endTime: new Date(newEnd) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      setRescheduleTarget(null);
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] }); // Update the calendar too!
      alert("Rescheduled!");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed");
    }
  });

  return (
    <div style={{ marginTop: 20 }}>
      <h2>My Bookings</h2>
      <ul>
        {bookings?.map((b: any) => (
          <li key={b._id} style={{ marginBottom: 10 }}>
            {b.roomId}: {new Date(b.startTime).toLocaleString()} 
            <button style={{ marginLeft: 10 }} onClick={() => setRescheduleTarget(b._id)}>
              Reschedule
            </button>
            
            {rescheduleTarget === b._id && (
              <div style={{ background: '#f0f0f0', padding: 10, marginTop: 5 }}>
                <input type="datetime-local" onChange={e => setNewStart(e.target.value)} />
                <input type="datetime-local" onChange={e => setNewEnd(e.target.value)} />
                <button onClick={() => mutation.mutate()}>Confirm Change</button>
                <button onClick={() => setRescheduleTarget(null)}>Cancel</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
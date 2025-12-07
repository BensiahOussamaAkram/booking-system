import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '../api';

export const CreateBookingForm = ({ token, roomId }: { token: string, roomId: string }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newBooking: any) => createBooking(token, newBooking),
    
    // Optimistic Update
    onMutate: async (newBooking) => {
      await queryClient.cancelQueries({ queryKey: ['availability'] });
      const previous = queryClient.getQueryData(['availability', roomId]);
      
      // We purposefully don't update the cache manually here for complexity reasons,
      // but typically you would insert the fake booking into the UI state here.
      return { previous };
    },
    onError: (err, newBooking, context) => {
       // Rollback if conflict
       alert("Booking Failed: " + (err as any).response?.data?.message);
       if(context?.previous) {
         queryClient.setQueryData(['availability', roomId], context.previous);
       }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    }
  });

  const handleSubmit = () => {
    mutation.mutate({
      roomId,
      startTime: new Date(start).toISOString(),
      endTime: new Date(end).toISOString()
    });
  };

  return (
    <div style={{ marginTop: 20, borderTop: '1px solid #eee', paddingTop: 20 }}>
      <h3>Book Slot</h3>
      <input type="datetime-local" onChange={e => setStart(e.target.value)} />
      <input type="datetime-local" onChange={e => setEnd(e.target.value)} />
      <button onClick={handleSubmit} disabled={mutation.isPending}>
        {mutation.isPending ? 'Booking...' : 'Confirm'}
      </button>
    </div>
  );
};
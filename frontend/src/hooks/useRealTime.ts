import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useRealTimeBookings = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/bookings/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type !== 'connected') {
        queryClient.invalidateQueries({ queryKey: ['availability'] });
      }
    };
    return () => eventSource.close();
  }, [queryClient]);
};
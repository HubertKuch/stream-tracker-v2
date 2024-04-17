import { useEffect } from 'react';
import { useState } from 'react';

export type Channel = {
  id: string;
  name: string;
  externalId: string;
  link: string;
};

export function useChannels({ page }: { page: number }) {
  const [channels, setChannels] = useState<{
    channels: Channel[];
    totalItems: number;
    totalPages: number;
    page: number;
  }>({ channels: [], totalItems: 0, totalPages: 0, page: 0 });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3000/channels?page=${page || 0}`)
      .then((res) => res.json())
      .then((res) => setChannels(res));
  }, [refresh]);

  return { ...channels, refresh: () => setRefresh(Math.random()) };
}

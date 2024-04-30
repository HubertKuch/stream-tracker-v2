import { useEffect } from 'react';
import { useState } from 'react';
import { config } from '../config';

export type Channel = {
  id: string;
  name: string;
  externalId: string;
  donateLink: string;
  link: string;
};

export function useChannels({ page, search }: { page: number; search: string }) {
  const [channels, setChannels] = useState<{
    channels: Channel[];
    totalItems: number;
    totalPages: number;
    page: number;
  }>({ channels: [], totalItems: 0, totalPages: 0, page: 0 });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch(`${config.API_BASE}/channels?page=${page || 0}&search=${search}`)
      .then((res) => res.json())
      .then((res) => setChannels(res))
      window.scrollTo(0, 0)
  }, [page, refresh, search]);

  return { ...channels, refresh: () => setRefresh(Math.random()) };
}

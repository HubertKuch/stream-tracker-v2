import { useEffect } from 'react';
import { useState } from 'react';

export type Stream = {
  id: string;
  title: string;
  description: string;
  startedAt: string;
  endedAt: string;
  externalId: string;
  channelId: string;
};

export function useStreams(filters: { page: number; channelId?: string | null }) {
  const [streams, setStreams] = useState<{
    liveStreams: Stream[];
    totalItems: number;
    totalPages: number;
    page: number;
  }>({ liveStreams: [], totalItems: 0, totalPages: 0, page: 0 });

  useEffect(() => {
    let url = `http://localhost:3000/lives?page=${filters.page || 0}`;

    if (filters.channelId) url += `&channelId=${filters.channelId}`;

    console.log(filters);
    fetch(url)
      .then((res) => res.json())
      .then((res) => setStreams(res));
  }, [filters]);

  return streams;
}

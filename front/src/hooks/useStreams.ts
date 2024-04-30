import { useEffect } from 'react';
import { useState } from 'react';
import { config } from '../config';

export type Stream = {
  id: string;
  title: string;
  description: string;
  startedAt: string;
  endedAt: string;
  externalId: string;
  channelId: string;
  channel: { name: string };
};

export function useStreams(filters: { page: number; channelId?: string | null; online: boolean }) {
  const [streams, setStreams] = useState<{
    liveStreams: Stream[];
    totalItems: number;
    totalPages: number;
    page: number;
  }>({ liveStreams: [], totalItems: 0, totalPages: 0, page: 0 });

  useEffect(() => {
    let url = `${config.API_BASE}/lives?page=${filters.page || 0}&online=${filters.online}`;

    if (filters.channelId) url += `&channelId=${filters.channelId}`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => setStreams(res));
  }, [filters]);

  return streams;
}

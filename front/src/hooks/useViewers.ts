import { useEffect } from 'react';
import { useState } from 'react';
import { config } from '../config';

export type Viewers = {
  id: string;
  liveStreamId: string;
  at: string;
  viewers: number;
};

export function useViewers({ streamId }: { streamId: string }) {
  const [streams, setStreams] = useState<Viewers[]>([]);

  useEffect(() => {
    let url = `${config.API_BASE}/lives/${streamId}/views`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => setStreams(res));
  }, []);

  return streams;
}

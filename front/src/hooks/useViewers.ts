import { useEffect } from 'react';
import { useState } from 'react';

export type Viewers = {
  id: string;
  liveStreamId: string;
  at: string;
  viewers: number;
};

export function useViewers({ streamId }: { streamId: string }) {
  const [streams, setStreams] = useState<Viewers[]>([]);

  useEffect(() => {
    let url = `http://localhost:3000/lives/${streamId}/views`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => setStreams(res));
  }, []);

  return streams;
}

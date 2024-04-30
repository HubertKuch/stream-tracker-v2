import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import toast from 'react-hot-toast';
import { Viewers } from '../hooks/useViewers';

export default function ViewersChart({ viewers }: { viewers: Viewers[] }) {
  const [resolve, setResolve] = useState<Function | null>(null);
  const [promise, setPromise] = useState<Promise<unknown>>();

  useEffect(() => {
    if (promise) {
      promise.then(() =>
        toast.promise(promise, {
          loading: 'Pobieranie wykresu',
          success: 'Pobieranie wykresu',
          error: 'Nie udalo sie pobrac danych',
        }),
      );
    }
  }, [promise]);

  useEffect(() => {
    setPromise(
      new Promise((res) => {
        setResolve(res);

        setTimeout(() => {
          res('Promise resolved successfully');
        }, 30000000);
      }),
    );
  }, []);

  return (
    <Chart
      options={{
        chart: { id: 'base' },
        xaxis: { categories: viewers.map((v) => v.at) },
      }}
      series={[
        {
          name: 'series-1',
          data: viewers.map((v) => v.viewers),
        },
      ]}
      type="bar"
      height={'700'}
    />
  );
}

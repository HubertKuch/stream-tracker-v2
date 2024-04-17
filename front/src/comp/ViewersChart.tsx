import Chart from 'react-apexcharts';
import { Viewers } from '../hooks/useViewers';

export default function ViewersChart({ viewers }: { viewers: Viewers[] }) {
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

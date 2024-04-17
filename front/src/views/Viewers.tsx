import { useSearchParams } from 'react-router-dom';
import Template from '../App';
import ViewersChart from '../comp/ViewersChart';
import { useViewers } from '../hooks/useViewers';

export default function Viewers() {
  let [searchParams, setSearchParams] = useSearchParams();
  const viewers = useViewers({ streamId: searchParams.get('id') || '' });

  return (
    <Template refresh={() => {}}>
      <ViewersChart viewers={viewers} />
    </Template>
  );
}

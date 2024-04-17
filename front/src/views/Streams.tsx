import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Template from '../App';
import { useStreams } from '../hooks/useStreams';

function Streams() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [filters] = useState({ page: 0, channelId: searchParams.get('id') || null });
  const streams = useStreams(filters);

  return (
    <Template refresh={() => {}}>
      <div className="overflow-x-auto">
        <table className="table table-lg">
          <thead>
            <tr>
              <th />
              <th>Identyfikator</th>
              <th>Tytul</th>
              <th>Odnosnik</th>
              <th>Historia</th>
              <th>Data rozpoczecia</th>
              <th>Data zakonczenia</th>
              <th>Trwa</th>
              <th>Zewnetrzny identyfikator</th>
            </tr>
          </thead>
          <tbody>
            {streams?.liveStreams?.map((stream, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{stream.id}</td>
                <td>{stream.title}</td>
                <td>
                  <a
                    target="_blank"
                    className="link link-primary"
                    href={`https://www.youtube.com/watch?v=${stream.externalId}`}
                  >
                    https://www.youtube.com/watch?v={stream.externalId}
                  </a>
                </td>
                <td>
                  <a className="link" href={`/ogladajacy?id=${stream.id}`}>
                    Historia
                  </a>
                </td>
                <td>{stream.startedAt}</td>
                <td>{stream.endedAt || '-'}</td>
                <td>{stream.endedAt ? 'Nie' : 'Tak'}</td>
                <td>{stream.externalId}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th />
              <th>Identyfikator</th>
              <th>Tytul</th>
              <th>Odnosnik</th>
              <th>Historia</th>
              <th>Data rozpoczecia</th>
              <th>Data zakonczenia</th>
              <th>Trwa</th>
              <th>Zewnetrzny identyfikator</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </Template>
  );
}

export default Streams;

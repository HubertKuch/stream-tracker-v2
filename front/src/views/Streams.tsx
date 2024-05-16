import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Template from '../App';
import { useStreams } from '../hooks/useStreams';

function Streams() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({ page: 0, channelId: searchParams.get('id') || null, online: !searchParams.has('id') });
  const streams = useStreams(filters);

  return (
    <Template refresh={() => {}}>
      <div className="mb-5">
        <div className="form-control">
          <label className="label cursor-pointer w-fit">
            <input
              type="checkbox"
              className="toggle"
              defaultChecked={true}
              onChange={() => setFilters((prev) => ({ ...prev, online: !filters.online }))}
            />
            <span className="ml-5 label-text">Tylko na zywo </span>
          </label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-lg">
          <thead>
            <tr>
              <th />
              <th>Identyfikator</th>
              <th>Tytul</th>
              <th>Kanal</th>
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
                <td>{stream.channel.name}</td>
                <td>
                  <a
                    target="_blank"
                    className="link link-primary"
                    href={ stream.channel.platform === "YOUTUBE" ? `https://www.youtube.com/watch?v=${stream.externalId}` : stream.channel.link }
                  >

		  Odnosnik
                  </a>
                </td>
                <td>
                  <a className="link link-primary" href={`/ogladajacy?id=${stream.id}`}>
                    Historia
                  </a>
                </td>
                <td>{stream.startedAt.replace("T", " ").replace("Z", " ")}</td>
                <td>{stream.endedAt?.replace("T", " ").replace("Z", " ") || '-'}</td>
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
              <th>Kanal</th>
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

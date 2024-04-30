import { useEffect, useLayoutEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Template from '../App';
import SearchInput from '../comp/SearchInput';
import { config } from '../config';
import { Channel, useChannels } from '../hooks/useChannels';

function Main() {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const { channels, refresh, totalPages} = useChannels({ page, search });
  const [pagination, setPagination] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const pages = [];

console.log(totalPages)
    for (let i = 0; i !== totalPages; i++) {
    console.log(2);
      pages.push(
        <button onClick={() => setPage(i)} key={i} className={`join-item btn ${i === page ? 'btn-active' : ''}`}>
          {i + 1}
        </button>,
      );
    }

    setPagination(pages);
  }, [channels]);

  return (
    <Template refresh={refresh}>
      <SearchInput setState={setSearch} />
      <div className="overflow-x-auto">
        <table className="table table-lg">
          <thead>
            <tr>
              <th />
              <th>Identyfikator</th>
              <th>Nazwa</th>
              <th>Odnosnik</th>
              <th>Serwis</th>
              <th>Historia</th>
              <th>Zewnetrzny identyfikator</th>
              <th>Usun</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel: Channel, i: number) => (
              <tr>
                <td>{i + 1}</td>
                <td>{channel.id}</td>
                <td>{channel.name}</td>
                <td>
                  <a className="link link-primary" href={channel.link} target="_blank">
                    {channel.link}
                  </a>
                </td>
                <td>
                  <a className="link link-primary" href={channel.donateLink} target="_blank">
                    Serwis
                  </a>
                </td>
                <td>
                  <a href={`/streamy?id=${channel.id}`} className="link link-primary">
                    Historia
                  </a>
                </td>
                <td>{channel.externalId}</td>
                <td>
                  <button
                    className="link-error"
                    onClick={() => document.getElementById(`dialog-${channel.externalId}`)?.showModal()}
                  >
                    Usun
                  </button>
                  <dialog id={'dialog-' + channel.externalId} className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Czy na pewno chcesz usunac ten kanal?</h3>
                      <p className="py-4">
                        Operacja nie bedzie mozliwa do cofniecia a wszystkie powiazane dane zostana usuniete
                      </p>
                      <div className="modal-action">
                        <form method="dialog" className="flex gap-5">
                          <button
                            className="btn btn-success bg-[#7fe67f]"
                            onClick={() => {
                              fetch(`${config.API_BASE}/channels/${channel.id}`, { method: 'DELETE' })
                                .then(() => {
                                  toast.success('Usunieto kanal');
                                  refresh();
                                })
                                .catch(() => toast.error('Nie udalo sie usunac kanalu'));
                            }}
                          >
                            Tak
                          </button>

                          <button className="btn btn-error">Nie</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th />
              <th>Identyfikator</th>
              <th>Nazwa</th>
              <th>Odnosnik</th>
              <th>Serwis</th>
              <th>Historia</th>
              <th>Zewnetrzny identyfikator</th>
              <th>Usun</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <footer className="flex justify-center mt-5">
        <div className="join">{pagination}</div>
      </footer>
    </Template>
  );
}

export default Main;

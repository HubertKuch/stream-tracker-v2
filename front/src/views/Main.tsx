import toast from 'react-hot-toast';
import Template from '../App';
import { Channel, useChannels } from '../hooks/useChannels';

function Main() {
  const { channels, refresh } = useChannels({ page: 0 });

  return (
    <Template refresh={refresh}>
      <div className="overflow-x-auto">
        <table className="table table-lg">
          <thead>
            <tr>
              <th />
              <th>Identyfikator</th>
              <th>Nazwa</th>
              <th>Odnosnik</th>
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
                  <a href={`/streamy?id=${channel.id}`} className="link">
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
                              fetch(`http://localhost:3000/channels/${channel.id}`, { method: 'DELETE' })
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
              <th>Historia</th>
              <th>Zewnetrzny identyfikator</th>
              <th>Usun</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </Template>
  );
}

export default Main;

import toast from 'react-hot-toast';
import { config } from '../config';

export default function NavBar({ refresh }: { refresh: any }) {
  return (
    <div className="navbar bg-base-300 flex justify-around">
      <div className="w-1/2">
        <div className="">
          <span className="btn btn-ghost text-xl">StreamTracker v2.0</span>
        </div>
        <div className="flex flex-1 gap-5">
          <a className="link" href="/">
            Kanaly
          </a>
          <a className="link" href="/streamy">
            Streamy
          </a>
        </div>
      </div>
      <div className="w-1/2 justify-end">
        <button className="btn btn-primary" onClick={() => document.getElementById('add-modal').showModal()}>
          Dodaj
        </button>
        <dialog id="add-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Dodawanie kanalu</h3>
            <main className="py-4 flex flex-col gap-5">
              <label className="input input-bordered flex items-center gap-2">
                <span className="text-blue-300">Nazwa</span>
                <input name="name" type="text" className="grow" placeholder="" />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="text-blue-300">Link</span>
                <input name="link" type="text" className="grow link" placeholder="" />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="text-blue-300">Serwis (link)</span>
                <input name="donateLink" type="text" className="grow link" placeholder="" />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="text-blue-300">Platforma</span>
                <select name="platform" className="select select-ghost w-full ">
                  <option>YouTube</option>
                  <option>Twitch</option>
                </select>
              </label>
            </main>
            <div className="modal-action">
              <form method="dialog" className="flex gap-5">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    const name = document.querySelector('[name=name]')?.value;
                    const link = document.querySelector('[name=link]')?.value;
                    const donateLink = document.querySelector('[name=donateLink]')?.value;
                    const platform = document.querySelector('[name=platform]')?.value;

                    const res = await fetch(config.API_BASE + '/channels', {
                      method: 'POST',
                      body: JSON.stringify({ name, link, donateLink, platform }),
                      headers: { 'Content-Type': 'application/json' },
                    });

                    const json = await res.json();

                    if (res.status !== 200) {
                      return toast.error(json.message);
                    }

                    toast.success('Udalo sie dodac kanal');
                    refresh();
                  }}
                >
                  Dodaj
                </button>
                <button className="btn btn-error">Anuluj</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}

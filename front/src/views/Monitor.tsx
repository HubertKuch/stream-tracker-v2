import Template from '../App';
import { useJobs } from '../hooks/useMonitor';

export default function Monitor() {
  const jobs = useJobs();

  return (
    <Template refresh={() => {}}>
      <div className="hero min-h-screen ">
        <div className=" h-full w-full">
          <div className="join join-vertical w-full">
            {jobs.map((job) => (
              <div className="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="my-accordion-4" />
                <div className="collapse-title text-xl font-medium">
                  {job.status === 'stopped' ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#ef4444"
                      className="w-6 h-6 inline mr-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#22c55e"
                      className="w-6 h-6 inline mr-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                  {job.name}
                </div>
                <div className="collapse-content">
                  <h2 className="text-lg mb-5">Tresc bledu:</h2>
                  {job.errors.map((error) => (
                    <p>{error.message}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Template>
  );
}

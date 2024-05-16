import { useEffect } from 'react';
import { useState } from 'react';
import { config } from '../config';

export type JobError = { message: string };

export type Job = {
  name: string;
  status: string;
  errors: JobError[];
};

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetch(`${config.API_BASE}/monitor`)
      .then((res) => res.json())
      .then((res) => setJobs(res.jobs));
  }, []);

  return jobs;
}

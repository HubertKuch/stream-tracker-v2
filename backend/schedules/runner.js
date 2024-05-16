import { scheduleJob } from "node-schedule";
import db from "../statusmonitor/db.js";
import signale from "signale";

export default async function runner(name, cron, job) {
  try {
    await db.update(({ jobs }) =>
      jobs.some((job) => job.name === name)
        ? null
        : jobs.push({ name, errors: [], status: "ok" }),
    );

    await job();

    scheduleJob(cron, job);
  } catch (e) {
    signale.error(e.message);
    await db.update(({ jobs }) => {
      jobs.find((job) => job.name === name).status = "stopped";

      jobs
        .find((job) => job.name === name)
        ?.errors.push({ message: e.message });
    });
  }
}

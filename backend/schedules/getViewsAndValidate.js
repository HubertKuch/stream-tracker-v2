import schedule from "node-schedule";
import prisma from "../db.js";
import axios from "axios";
import signale from "signale";
import { nanoid } from "nanoid";

async function task() {
  const key = process.env.API_KEY;
  const liveStreams = await prisma.liveStream.findMany();

  for (const liveStream of liveStreams) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${liveStream.externalId}&key=${key}`;
    const res = await axios.get(url);

    if (res.data.items[0].liveStreamingDetails.actualEndTime) {
      await prisma.liveStream.update({
        where: { id: liveStream.id },
        data: { endedAt: res.data.items[0].liveStreamingDetails.actualEndTime },
      });

      signale.info(
        "Live stream %s ended at %s",
        liveStream.title,
        res.data.items[0].liveStreamingDetails.actualEndTime,
      );
      continue;
    }

    const concurrentViewers = parseInt(
      res.data.items[0].liveStreamingDetails.concurrentViewers,
    );

    signale.info(
      "Live stream %s has %d viewers",
      liveStream.title,
      concurrentViewers,
    );

    await prisma.viewers.create({
      data: {
        id: nanoid(),
        at: new Date().toJSON(),
        viewers: concurrentViewers,
        liveStreamId: liveStream.id,
      },
    });
  }
}

task().then();

const job = schedule.scheduleJob("*/5 * * * *", task);

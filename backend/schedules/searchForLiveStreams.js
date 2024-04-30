import schedule from "node-schedule";
import prisma from "../db.js";
import axios from "axios";
import signale from "signale";
import { nanoid } from "nanoid";

async function task() {
  const key = process.env.API_KEY;
  const channels = await prisma.channel.findMany();

  for (const channel of channels) {
   try { const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.externalId}&type=video&eventType=live&key=${key}`;

    const res = await axios.get(url);

    if (res.data.pageInfo.totalResults === 0) {
      continue;
    }

    const liveStream = {
      id: nanoid(),
      channelId: channel.id,
      externalId: res.data.items[0].id.videoId,
      title: res.data.items[0].snippet.title,
      description: res.data.items[0].snippet.description,
      startedAt: res.data.items[0].snippet.publishedAt,
    };

    signale.info("%s has live stream: %s", channel.name, liveStream.title);

    const alreadyExists = await prisma.liveStream.findFirst({
      where: { externalId: liveStream.externalId },
    });

    if (alreadyExists) continue;

    await prisma.liveStream.create({ data: liveStream });

  }
	  catch (e ) {signale.error("Error on searching live stream %s", e.message)}
  }
}

task().then();

const job = schedule.scheduleJob("*/10 * * * *", task);

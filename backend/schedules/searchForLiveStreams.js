import prisma from "../db.js";
import axios from "axios";
import signale from "signale";
import { nanoid } from "nanoid";
import { Platform } from "@prisma/client";
import TwitchWrapper from "../utils/TwitchWrapper.js";
import runner from "./runner.js";

export async function twitchSearchTask() {
  const channels = await prisma.channel.findMany({
    where: { platform: Platform.TWITCH },
  });

  const wrapper = new TwitchWrapper(
    process.env.TW_API_ID,
    process.env.TW_API_SECRET,
  );

  for (const channel of channels) {
    const apiStreams = await wrapper.getUser(channel.externalId);

    if (apiStreams.length === 0) continue;

    const liveStream = {
      id: nanoid(),
      channelId: channel.id,
      externalId: apiStreams[0].id,
      title: apiStreams[0].title,
      description: "",
      startedAt: apiStreams[0].started_at,
    };

    signale.info("%s has live stream: %s", channel.name, liveStream.title);

    const alreadyExists = await prisma.liveStream.findFirst({
      where: { externalId: liveStream.externalId },
    });

    if (alreadyExists) continue;

    await prisma.liveStream.create({ data: liveStream });
  }
}

export async function youtubeSearchTask() {
  const key = process.env.YT_API_KEY;
  const channels = await prisma.channel.findMany({
    where: { platform: Platform.YOUTUBE },
  });

  for (const channel of channels) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.externalId}&type=video&eventType=live&key=${key}`;

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
    } catch (e) {
      signale.error("Error on searching live stream %s", e.message);
    }
  }
}

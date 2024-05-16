import schedule from "node-schedule";
import prisma from "../db.js";
import axios from "axios";
import signale from "signale";
import { nanoid } from "nanoid";
import { Platform } from "@prisma/client";
import TwitchWrapper from "../utils/TwitchWrapper.js";
import runner from "./runner.js";

async function twitchTask() {
  const wrapper = new TwitchWrapper(
    process.env.TW_API_ID,
    process.env.TW_API_SECRET,
  );

  const liveStreams = await prisma.liveStream.findMany({
    where: { channel: { platform: Platform.TWITCH } },
    select: {
      channel: { select: { externalId: true } },
      id: true,
      title: true,
    },
  });

  for (const liveStream of liveStreams) {
    const res = await wrapper.getUser(liveStream.channel.externalId);

    const watchers = res.length !== 0 ? res[0].viewer_count : null;

    if (watchers === null) {
      await prisma.liveStream.update({
        where: { id: liveStream.id },
        data: { endedAt: new Date().toJSON() },
      });
      continue;
    }

    signale.info("Live stream %s has %d viewers", liveStream.title, watchers);
    await prisma.viewers.create({
      data: { id: nanoid(), viewers: watchers, liveStreamId: liveStream.id },
    });
  }
}

async function ytTask() {
  const key = process.env.YT_API_KEY;
  const liveStreams = await prisma.liveStream.findMany({
    where: { channel: { platform: Platform.YOUTUBE } },
  });

  for (const liveStream of liveStreams) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${liveStream.externalId}&key=${key}`;
      const res = await axios.get(url);

      if (
        res.data.items.length > 0 &&
        res.data.items[0]?.liveStreamingDetails?.actualEndTime
      ) {
        await prisma.liveStream.update({
          where: { id: liveStream.id },
          data: {
            endedAt: res.data.items[0].liveStreamingDetails.actualEndTime,
          },
        });

        signale.info(
          "Live stream %s ended at %s",
          liveStream.title,
          res.data.items[0].liveStreamingDetails.actualEndTime,
        );
        continue;
      }

      const concurrentViewers = parseInt(
        res.data.items[0]?.liveStreamingDetails?.concurrentViewers || -1,
      );

      if (isNaN(concurrentViewers) || concurrentViewers === -1) {
        await prisma.liveStream.update({
          where: { id: liveStream.id },
          data: { endedAt: new Date().toJSON() },
        });

        signale.info(
          "Live stream %s ended at %s",
          liveStream.title,
          res.data.items[0]?.liveStreamingDetails?.actualEndTime || new Date(),
        );

        continue;
      }

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
    } catch (e) {
      console.error("YouTube videos error ", e);
    }
  }
}

runner("YouTube - walidacja", "*/5  * * * *", ytTask).then();
runner("Twitch - walidacja", "*/5  * * * *", twitchTask).then();

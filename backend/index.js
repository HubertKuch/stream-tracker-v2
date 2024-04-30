import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { Hono } from "hono";

import prisma from "./db.js";
import validateChannelInput from "./schemas/channelSchema.js";
import channelId from "./utils/channelId.js";
import { nanoid } from "nanoid";
import signale from "signale";

import "./schedules/getViewsAndValidate.js";
import "./schedules/searchForLiveStreams.js";

import moment from "moment";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: [],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.get("/channels", async (c) => {
  const { page = 0, search = "" } = c.req.query();
  console.log(search);
  const perPage = 50;
  const channels = await prisma.channel.findMany({
    take: perPage,
    skip: page * perPage,
    where: {
      OR: [
        { id: { contains: search } },
        { name: { contains: search } },
        { externalId: { contains: search } },
	{ donateLink: {contains: search } }
      ],
    },
  });

  const totalItems = await prisma.channel.count();
  return c.json({
    page: parseInt(page),
    totalPages: Math.ceil(totalItems / perPage),
    totalItems,
    channels,
  });
});

app.post("/channels", async (c) => {
  const data = await c.req.json();
  const valid = validateChannelInput(data);

  if (!valid)
    return c.json({ message: "Link, nazwa oraz serwis sa wymagane" }, 400);

  const externalId = await channelId(data.link);

  if (!externalId) {
    return c.json({ message: "Nie mozna pobrac id kanalu" }, 400);
  }

  if (await prisma.channel.findFirst({where: { externalId }})) return c.json({message: "Nie mozna dodac duplikatu kanalu"}, 400)

  const channel = await prisma.channel.create({
    data: { ...data, externalId, id: nanoid() },
  });

  signale.debug("Dodano kanal: %s o id %s", data.name, externalId);

  return c.json(channel);
});

app.delete("/channels/:id", async (c) => {
  const { id } = c.req.param();

  await prisma.channel.delete({ where: { id } });

  signale.debug("Usunieto kanal o id: %s", id);

  return c.json({ message: "Usunieto kanal" }, 200);
});

app.get("/lives", async (c) => {
  const { page = 0, channelId = null, online = false } = c.req.query();
  const filters = {};

  if (channelId) filters.channelId = channelId;
  if (online === "true") filters.endedAt = { equals: null };

  const perPage = 50;
  const liveStreams = await prisma.liveStream.findMany({
    take: perPage,
    skip: page * perPage,
    where: filters,
    include: { channel: { select: { name: true } } },
  });
  const totalItems = await prisma.liveStream.count({ where: filters });

  return c.json({
    page: parseInt(page),
    totalPages: parseInt(totalItems / perPage),
	filters,
	  totalItems,
    liveStreams,
  });
});

app.get("/lives/:id/views", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ message: "Id jest wymagane" }, 400);
  }

	const lastViews = (await prisma.viewers.findFirst({where: {liveStreamId: id}, orderBy: { at: 'desc' }}));
  const date = lastViews ? moment(lastViews?.at) : moment();

  date.subtract(24, "hours");

  const data = await prisma.viewers.findMany({
    where: {
      at: {
        gte: date.toJSON(),
      },
      liveStreamId: id,
    },
    orderBy: {at: 'asc'}
  });

  return c.json(data, 200);
});

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import prisma from "./db.js";
import validateChannelInput from "./schemas/channelSchema.js";
import channelId from "./utils/channelId.js";
import { nanoid } from "nanoid";
import signale from "signale";

const app = new Hono();

app.get("/channels", async (c) => {
  const { page = 0 } = c.req.query();
  const perPage = 25;
  const channels = await prisma.channel.findMany({
    take: perPage,
    skip: page * perPage,
  });

  const totalItems = await prisma.channel.count();
  return c.json({
    page: parseInt(page),
    totalPages: parseInt(totalItems / perPage),
    totalItems,
    channels,
  });
});

app.post("/channels", async (c) => {
  const data = await c.req.json();
  const valid = validateChannelInput(data);

  if (!valid) return c.json({ message: "Link oraz nazwa sa wymagane" }, 400);

  const externalId = await channelId(data.link);

  if (!externalId) {
    return c.json({ message: "Nie mozna pobrac id kanalu" }, 400);
  }

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
  const { page = 0, channelId = null } = c.req.query();
  const filters = {};

  if (channelId) filters.channelId = channelId;

  const perPage = 25;
  const channels = await prisma.liveStream.findMany({
    take: perPage,
    skip: page * perPage,
    where: filters,
  });
  const totalItems = await prisma.liveStream.count({ where: filters });

  return c.json({
    page: parseInt(page),
    totalPages: parseInt(totalItems / perPage),
    totalItems,
    channels,
  });
});

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});

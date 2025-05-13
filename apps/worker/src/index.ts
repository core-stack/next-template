import "./workers";

import express from "express";

import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { getQueue, QueueName } from "@packages/queue";

const run = async () => {
  const app = express();

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/');

  createBullBoard({
    queues: [
      new BullMQAdapter(getQueue(QueueName.COMPRESS_IMAGE)),
      new BullMQAdapter(getQueue(QueueName.EMAIL)),
    ],
    serverAdapter,
  });

  app.use('/', serverAdapter.getRouter());

  app.listen(4000, () => {
    console.log('Worker is running on port 4000');
  });
};

run().catch((e) => console.error(e));
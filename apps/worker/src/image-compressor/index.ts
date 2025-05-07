import { CompressImagePayload, QueueName } from "@packages/queue";
import { redisConnection } from "@packages/queue/redis";
import { getObject, putObject } from "@packages/storage";
import { Job, Worker } from "bullmq";
import sharp from "sharp";
import Stream from "stream";

const streamToBuffer = async (readableStream: any) => {
  const chunks: any[] = []
  for await (const chunk of readableStream) chunks.push(chunk)
  return Buffer.concat(chunks)
}

const compressorWorker = new Worker<CompressImagePayload>(
  QueueName.COMPRESS_IMAGE,
  async (job: Job<CompressImagePayload>) => {
    const { key, width, height } = job.data;
    const obj = await getObject(key);

    const imageBuffer = await streamToBuffer(obj as Stream.Readable)

    const compressedBuffer = await sharp(imageBuffer)
      .resize(width || null, height || null)
      .webp({ quality: 60 })
      .toBuffer()

    await putObject(key, compressedBuffer, "image/webp");
  },
  { connection: redisConnection }
);

compressorWorker.on('completed', (job) => {
  console.log(`compressorWorker job ${job.id} completed`);
});

compressorWorker.on('failed', (job, err) => {
  console.error(`compressorWorker job ${job?.id} failed:`, err);
});

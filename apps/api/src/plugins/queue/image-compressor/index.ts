import { Job } from "bullmq";
import { FastifyInstance } from "fastify";
import sharp from "sharp";
import Stream from "stream";

import { CompressImagePayload } from "./schema";

const streamToBuffer = async (readableStream: Stream.Readable): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of readableStream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async (app:FastifyInstance, job: Job<CompressImagePayload>) => {
  const { key, width, height } = job.data;
  const obj = await app.storage.getObject(key);

  const imageBuffer = await streamToBuffer(obj as Stream.Readable);
  const compressedBuffer = await sharp(imageBuffer).resize(width, height).webp({ quality: 60 }).toBuffer();
  await app.storage.putObject(key, compressedBuffer, "image/webp");
}
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import sharp from "sharp";
import Stream from "stream";

import { StorageService } from "../storage/storage.service";

import { CompressImagePayload } from "./compress-image.types";
import { QueueName } from "./types";

@Processor(QueueName.COMPRESS_IMAGE)
export class CompressImageProcessor extends WorkerHost {
  private readonly logger = new Logger(CompressImageProcessor.name);
  @Inject() private readonly storage: StorageService;

  private async streamToBuffer(readableStream: Stream.Readable): Promise<Buffer> {
    const chunks: any[] = [];
    for await (const chunk of readableStream) chunks.push(chunk);
    return Buffer.concat(chunks);
  }

  async process(job: Job<CompressImagePayload>) {
    const { key, width, height } = job.data;
    const obj = await this.storage.getObject(key);

    const imageBuffer = await this.streamToBuffer(obj as Stream.Readable);
    // prettier-ignore
    const compressedBuffer = await sharp(imageBuffer).resize(width, height).webp({ quality: 60 }).toBuffer();

    await this.storage.putObject(key, compressedBuffer, "image/webp");
  }
}

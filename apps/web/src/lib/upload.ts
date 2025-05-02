import { env } from "@/env";
import {
  CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { redis } from "./redis";

export const s3 = new S3Client({
  region: "auto",
  endpoint: env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});


export async function getPresignedUrl(
  filename: string,
  contentType: string,
) {

  const key = `tmp/${Date.now()}-${filename}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { url, key };
}

export async function getPresignedGetUrl(key: string, expiresIn = 60) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn });
}

const TTL_SECONDS = 60 * 60 * 24; // 1 day

export async function trackTemporaryUpload(key: string) {
  await redis.set(`upload:${key}`, "pending", "EX", TTL_SECONDS);
}

export async function confirmUpload(key: string) {
  const newKey = key.replace(/^tmp\//, "uploads/");

  await s3.send(new CopyObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    CopySource: `${process.env.R2_BUCKET!}/${key}`,
    Key: newKey,
  }));

  await s3.send(new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
  }));

  await redis.set(`upload:${newKey}`, "confirmed");
}

export async function isConfirmed(key: string): Promise<boolean> {
  const status = await redis.get(`upload:${key}`);
  return status === "confirmed";
}
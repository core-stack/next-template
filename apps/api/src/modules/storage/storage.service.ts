import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { env } from "@packages/env";

const s3 = new S3Client({
  region: "auto",
  endpoint: env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

@Injectable()
export class StorageService {
  async getPreSignedUploadUrl(key: string, contentType: string, publicAccess = false): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: key,
      ContentType: contentType,
      ACL: publicAccess ? "public-read" : "private",
    });

    return getSignedUrl(s3, command, { expiresIn: 300 });
  }

  async getPreSignedDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: key,
    });

    return getSignedUrl(s3, command, { expiresIn: 300 });
  }

  async getObject(key: string): Promise<NodeJS.ReadableStream | null> {
    const command = new GetObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: key,
    });

    const result = await s3.send(command);
    return result.Body as NodeJS.ReadableStream | null;
  }

  async putObject(key: string, body: Buffer, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await s3.send(command);
  }

  buildPublicUrl(key: string): string {
    return `${env.AWS_PUBLIC_BUCKET_BASE_URL}/${key}`;
  }
}

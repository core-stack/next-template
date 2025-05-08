import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@packages/env';

export const s3 = new S3Client({
  region: "auto",
  endpoint: env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function getPreSignedUploadUrl(
  key: string,
  contentType: string,
  publicAccess: boolean = false
) {
  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: publicAccess ? "public-read" : "private",
  });
  
  return await getSignedUrl(s3, command, { expiresIn: 300 });
}

export async function getPreSignedDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 300 });
}

export async function getObject(key: string) {
  const getCmd = new GetObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: key,
  })

  const s3Obj = await s3.send(getCmd)
  return s3Obj.Body
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  const getCmd = new PutObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType
  });

  await s3.send(getCmd);
}

export function buildPublicUrl(key: string) {
  return `${env.AWS_PUBLIC_BUCKET_BASE_URL}/${key}`
}

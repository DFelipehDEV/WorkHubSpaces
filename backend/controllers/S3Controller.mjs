import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: "auto", // Required by AWS SDK, not used by R2
  // Provide your R2 endpoint: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  endpoint: process.env.S3_API_URL,
  credentials: {
    // Provide your R2 Access Key ID and Secret Access Key
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const getUrl = await getSignedUrl(
  S3,
  new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: "image.png" }),
  { expiresIn: 3600 }, // Valid for 1 hour
);
// https://my-bucket.<ACCOUNT_ID>.r2.cloudflarestorage.com/image.png?X-Amz-Algorithm=...

// Generate presigned URL for writing (PUT)
// Specify ContentType to restrict uploads to a specific file type
const putUrl = await getSignedUrl(
  S3,
  new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: "image.png",
    ContentType: "image/png",
  }),
  { expiresIn: 3600 },
);

console.log(putUrl)
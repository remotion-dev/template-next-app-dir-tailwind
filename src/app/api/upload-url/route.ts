// app/api/upload-url/route.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req) {
  try {
    const { filename, contentType } = await req.json(); // Parse the JSON request body

    if (!filename || !contentType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const objectKey = `uploads/${Date.now()}_${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const fileUrl = `${objectKey.replace("uploads/","")}`;
    return new Response(
      JSON.stringify({ uploadUrl, fileUrl }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate upload URL" }),
      { status: 500 }
    );
  }
}

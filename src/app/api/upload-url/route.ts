// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { GoogleGenAI } from "@google/genai";
// import { createUserContent } from "@google/genai";
// import fs from "fs/promises";
// import fetch from "node-fetch";
// import path from "path";
// import { randomUUID } from "crypto";


// const s3Client = new S3Client({
//   region: "auto",
//   endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
//   credentials: {
//     accessKeyId: process.env.R2_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
//   },
// });


// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export async function POST(req) {
//   try {
//     const { filename, contentType } = await req.json();
//     if (!filename || !contentType) {
//       return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
//     }

//     // Step 1: Generate S3 upload URL
//     const objectKey = `uploads/${Date.now()}_${filename}`;
//     const command = new PutObjectCommand({
//       Bucket: process.env.R2_BUCKET_NAME,
//       Key: objectKey,
//       ContentType: contentType,
//     });

//     const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
//     const fileUrl = objectKey.replace("uploads/", "");
//     console.log(fileUrl)
//     const publicVideoUrl = `https://pub-449b3b5dd7dc457e86e54d9c58eaa858.r2.dev/uploads/${fileUrl}`;
//     console.log(publicVideoUrl);
//     // Step 2: Download video to local
//     const videoResponse = await fetch(publicVideoUrl);
//     if (!videoResponse.ok) throw new Error("Failed to download uploaded video");

//     const buffer = Buffer.from(await videoResponse.arrayBuffer());
//     const tempFilename = `${randomUUID()}.mp4`;
//     const downloadsDir = path.join(process.cwd(), "downloads");
//     await fs.mkdir(downloadsDir, { recursive: true });
//     const filePath = path.join(downloadsDir, tempFilename);
//     await fs.writeFile(filePath, buffer);

//     // Step 3: Upload to Gemini
//     const uploadedFile = await ai.files.upload({
//       file: filePath,
//       config: { mimeType: "video/mp4" },
//     });

//     let fileState = uploadedFile.state;
//     while (fileState !== "ACTIVE") {
//       await new Promise((res) => setTimeout(res, 5000));
//       const updatedFile = await ai.files.get({ name: uploadedFile.name });
//       fileState = updatedFile.state;
//     }

//     // Step 4: Ask Gemini to generate captions
//     const result = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: createUserContent([
//         {
//           fileData: {
//             fileUri: uploadedFile.uri,
//             mimeType: "video/mp4",
//           },
//         },
//         {
//           text: `
//           Make this exactly into single tanglish words. I am going to display this as captions in video, so though the content is in tamil, I want to display a transliterated version of it which means I want it to be displayed in tanglish. So give me a tanglish text. Dont give me 1 full sentence in tanglish. I want each word to be broken down and converted to tanglish and should be displayed in the json format I have provided. Dont use english words unless the original speaker has spoken a english word in which case, you can display english. Basically transliterate it in a normal spoke tanglish way. Use this JSON format for response, dont deviate from this JSON format:  
          
//           {
//     Make sure the milliseconds are accurate, I dont want to see any difference in the time in which the text was uttered and the time in which it is displayed.
//     "text": " the word in tanglish with a space as a prefix",
//     "startMs": the start time of the word in milliseconds,
//     "endMs": the end time of the word in milliseconds,
//     "timestampMs": the average of the start and end time in milliseconds,
//     "confidence": the confidence score of the text
//         }
//     Very important: there should be a space as a prefix to each text word. Very Important 


//     here is an example
    
//     { "text": "hey", "startMs": 330, "endMs": 400, "timestampMs": 420, "confidence": 1.0 },
//     { "text": " guys.", "startMs": 500, "endMs": 700, "timestampMs": 500, "confidence": 1.0 },
//     { "text": " na", "startMs": 1040, "endMs": 1170, "timestampMs": 1040, "confidence": 0.963153600692749 },
//     { "text": " inga", "startMs": 1230, "endMs": 1500, "timestampMs": 1230, "confidence": 0.9821343421936035 },
//     { "text": " Flutter", "startMs": 1590, "endMs": 2040, "timestampMs": 1590, "confidence": 0.977540910243988 },
//     { "text": " eventku", "startMs": 2040, "endMs": 2470, "timestampMs": 2040, "confidence": 0.9611732959747314 },
//     { "text": " third", "startMs": 2510, "endMs": 2740, "timestampMs": 2510, "confidence": 0.9724959135055542 },
//     { "text": " time", "startMs": 2740, "endMs": 2890, "timestampMs": 2740, "confidence": 0.9895510077476501 },
//     { "text": " varen.", "startMs": 2890, "endMs": 3260, "timestampMs": 2890, "confidence": 0.9883281588554382 },
//     { "text": " so", "startMs": 3380, "endMs": 3480, "timestampMs": 3380, "confidence": 0.970455527305603 },
//     { "text": " eppayum", "startMs": 3480, "endMs": 3980, "timestampMs": 3480, "confidence": 0.9785779714584351 },
//     { "text": " pola", "startMs": 3980, "endMs": 4250, "timestampMs": 3980, "confidence": 0.9884575605392456 },
//     { "text": " superra", "startMs": 4250, "endMs": 4660, "timestampMs": 4250, "confidence": 0.9728028774261475 },
//     { "text": " panni", "startMs": 4660, "endMs": 4940, "timestampMs": 4660, "confidence": 0.9801964163780212 },
//     { "text": " irukkanga.", "startMs": 4940, "endMs": 5430, "timestampMs": 4940, "confidence": 0.9782485961914062 },
//     { "text": " first", "startMs": 5880, "endMs": 6230, "timestampMs": 5880, "confidence": 0.9451284408569336 },
//     { "text": " year", "startMs": 6230, "endMs": 6450, "timestampMs": 6230, "confidence": 0.9851028919219971 },
//     { "text": " anniversary", "startMs": 6450, "endMs": 7270, "timestampMs": 6450, "confidence": 0.9850393533706665 },

//     the above is just an example, dont use it anywhere else in response.
//     `,
//         },
//       ]),
//     });

//     const output = result.text?.trim();
//     const jsonMatch = output?.match(/```json\s*([\s\S]*?)\s*```/);
//     if (!jsonMatch) throw new Error("Failed to extract JSON from model output");

//     const parsedJson = JSON.parse(jsonMatch[1]);

//     // Step 5: Upload caption JSON
//     const jsonFilename = filename.replace(/\.(mp4|mov)$/i, ".json");
//     const captionKey = `uploads/${jsonFilename}`;
//     const captionUploadCommand = new PutObjectCommand({
//       Bucket: process.env.R2_BUCKET_NAME,
//       Key: captionKey,
//       ContentType: "application/json",
//       Body: JSON.stringify(parsedJson),
//     });

//     await s3Client.send(captionUploadCommand);

//     // Final response
//     return new Response(
//       JSON.stringify({
//         uploadUrl,
//         fileUrl,
//       }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Error:", err);
//     return new Response(JSON.stringify({ error: err.message || "Unknown error" }), { status: 500 });
//   }
// }
// app/api/upload-url/route.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest } from "next/server";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
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
    console.log(`https://pub-449b3b5dd7dc457e86e54d9c58eaa858.r2.dev/uploads/${fileUrl}`)
    
    
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

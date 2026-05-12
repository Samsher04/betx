import { generatePresignedUrlFromS3Url } from "../../socketClient";

export async function generatePresignedUrl(s3Urlurl) {

  try {
    const url = await generatePresignedUrlFromS3Url(s3Urlurl);    
    return url?.url;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw error;
  }
}


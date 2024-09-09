import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const uploadVideo = async (s3: S3Client, videoPath: string) => {
	// s3.send(new PutObjectCommand({ Bucket: }))
}

import type { S3Client } from '@aws-sdk/client-s3'
import fs from 'node:fs'
import { Upload } from '@aws-sdk/lib-storage'

type UploadVideoRequest = {
	s3: S3Client
	bucketName: string
	videoPath: string
}

export const uploadVideo = async ({
	s3,
	bucketName,
	videoPath,
}: UploadVideoRequest) => {
	const stream = fs.createReadStream(videoPath)

	try {
		const uploadToS3 = new Upload({
			client: s3,
			params: {
				Bucket: bucketName,
				Key: videoPath,
				Body: stream,
			},
		})

		uploadToS3.on('httpUploadProgress', (progress) =>
			console.log(`Uploading video, current progress: ${progress}`),
		)

		await uploadToS3.done()
	} catch (e) {
		if (e instanceof Error) {
			console.error(
				`Failed to upload video, the following error occurred ${e.message}`,
			)
		} else {
			console.error('Failed to upload video, an unknown error occurred.')
		}
	}
}

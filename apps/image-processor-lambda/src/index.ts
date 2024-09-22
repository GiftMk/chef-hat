import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { ClientContext } from 'aws-lambda'
import { Readable } from 'node:stream'

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export const handler = async (context: ClientContext) => {
	const imageBucket = context.Custom.bucketName
	const imageKey = context.Custom.imageKey

	const response = await s3Client.send(
		new GetObjectCommand({ Bucket: imageBucket, Key: imageKey }),
	)

	const imageStream = response.Body
	if (!(imageStream instanceof Readable)) {
		console.error('Response body is not a readable stream')
		return
	}
}

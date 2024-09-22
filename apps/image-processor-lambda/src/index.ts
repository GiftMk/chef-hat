import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { ClientContext } from 'aws-lambda'
import { Readable } from 'node:stream'
import { resizeImage } from './resizeImage'
import { SixteenByNine } from './AspectRatio'
import { isFailure } from '@chef-hat/ts-result'
import { uploadToS3 } from '@chef-hat/s3-utils'
import fs from 'node:fs'

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export const handler = async (context: ClientContext) => {
	const imageBucket = context.Custom.bucket
	const imageKey = context.Custom.imageKey
	const outputBucket = context.Custom.outputBucket

	const response = await s3Client.send(
		new GetObjectCommand({ Bucket: imageBucket, Key: imageKey }),
	)

	const imageStream = response.Body
	if (!(imageStream instanceof Readable)) {
		console.error('Response body is not a readable stream')
		return
	}
	const imageBuffer = Buffer.concat(await imageStream.toArray())
	const outputPath = `/temp/${imageKey}`

	const resizeResult = await resizeImage(imageBuffer, SixteenByNine, outputPath)
	if (isFailure(resizeResult)) {
		console.error(resizeResult.error)
		return
	}

	const body = fs.createReadStream(outputPath)
	const uploadResult = await uploadToS3({
		s3Client,
		bucket: outputBucket,
		key: imageKey,
		body,
	})

	if (isFailure(uploadResult)) {
		console.error(uploadResult.error)
	}
}

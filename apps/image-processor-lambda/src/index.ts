import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { ClientContext } from 'aws-lambda'
import { resizeImage } from './resizeImage'
import { SixteenByNine } from './AspectRatio'
import { isFailure } from '@chef-hat/ts-result'
import { uploadToS3, writeBodyToFile } from '@chef-hat/s3-utils'
import fs from 'node:fs'
import { logger } from './logger'

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export const handler = async (context: ClientContext) => {
	const imageBucket = context.Custom.bucket
	const imageKey = context.Custom.imageKey
	const outputBucket = context.Custom.outputBucket

	const response = await s3Client.send(
		new GetObjectCommand({ Bucket: imageBucket, Key: imageKey }),
	)
	const imagePath = `/temp/${imageKey}-raw`
	const writeBodyResult = await writeBodyToFile(response.Body, imagePath)
	if (isFailure(writeBodyResult)) {
		logger.error(writeBodyResult.error)
		return
	}

	const outputPath = `/temp/${imageKey}`
	const resizeResult = await resizeImage(imagePath, SixteenByNine, outputPath)
	if (isFailure(resizeResult)) {
		logger.error(resizeResult.error)
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
		logger.error(uploadResult.error)
	}
}

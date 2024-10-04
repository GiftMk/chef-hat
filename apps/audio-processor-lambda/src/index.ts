import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { ClientContext } from 'aws-lambda'
import { isFailure } from '@chef-hat/ts-result'
import { uploadToS3, writeBodyToFile } from '@chef-hat/s3-utils'
import fs from 'node:fs'
import { normaliseAudio } from './normalisation/normaliseAudio'

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export const handler = async (context: ClientContext) => {
	const audioBucket = context.Custom.bucket
	const audioKey = context.Custom.audioKey
	const outputBucket = context.Custom.outputBucket

	const response = await s3Client.send(
		new GetObjectCommand({ Bucket: audioBucket, Key: audioKey }),
	)
	const audioPath = `/temp/${audioKey}-raw`

	const writeBodyResult = await writeBodyToFile(response.Body, audioPath)
	if (isFailure(writeBodyResult)) {
		console.error(writeBodyResult.error)
		return
	}

	const outputPath = `/temp/${audioKey}`

	const normaliseResult = await normaliseAudio(audioPath, outputPath)
	if (isFailure(normaliseResult)) {
		console.error(normaliseResult.error)
		return
	}

	const body = fs.createReadStream(outputPath)
	const uploadResult = await uploadToS3({
		s3Client,
		bucket: outputBucket,
		key: audioKey,
		body,
	})

	if (isFailure(uploadResult)) {
		console.error(uploadResult.error)
	}
}

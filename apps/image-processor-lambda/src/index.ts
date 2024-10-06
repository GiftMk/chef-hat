import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { resizeImage } from './resizeImage'
import { SixteenByNine } from './dimensions/AspectRatio'
import { isFailure } from '@chef-hat/ts-result'
import { uploadToS3, writeBodyToFile, toAWSFilePath } from '@chef-hat/aws-utils'
import fs from 'node:fs'
import { logger } from './logger'
import path from 'node:path'

const s3Client = new S3Client({ region: process.env.AWS_REGION })

type InputState = {
	inputBucket: string
	inputKey: string
	outputBucket: string
}

type OutputState = {
	outputBucket: string
	outputKey: string
}

type Error = {
	error: string
}

export const handler = async (
	state: InputState,
): Promise<OutputState | Error> => {
	const inputBucket = state.inputBucket
	const inputKey = decodeURIComponent(state.inputKey.replace(/\+/g, ' '))
	const outputBucket = state.outputBucket

	const response = await s3Client.send(
		new GetObjectCommand({ Bucket: inputBucket, Key: inputKey }),
	)
	const imagePath = toAWSFilePath(`raw-${inputKey}`)
	const writeBodyResult = await writeBodyToFile(response.Body, imagePath)
	if (isFailure(writeBodyResult)) {
		logger.error(writeBodyResult.error)
		return writeBodyResult
	}

	const outputKey = `${path.parse(inputKey).name}.png`
	const outputPath = toAWSFilePath(outputKey)
	const resizeResult = await resizeImage(imagePath, SixteenByNine, outputPath)
	if (isFailure(resizeResult)) {
		logger.error(resizeResult.error)
		return resizeResult
	}

	const body = fs.createReadStream(outputPath)
	const uploadResult = await uploadToS3({
		s3Client,
		bucket: outputBucket,
		key: outputKey,
		body,
	})

	if (isFailure(uploadResult)) {
		logger.error(uploadResult.error)
		return uploadResult
	}

	return { outputBucket, outputKey }
}

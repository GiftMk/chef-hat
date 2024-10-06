import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { isFailure } from '@chef-hat/ts-result'
import {
	uploadToS3,
	writeBodyToFile,
	toAWSFilePath,
	decodeS3Key,
} from '@chef-hat/aws-utils'
import fs from 'node:fs'
import { normaliseAudio } from './normalisation/normaliseAudio'
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
	const inputKey = decodeS3Key(state.inputKey)
	const outputBucket = state.outputBucket

	const response = await s3Client.send(
		new GetObjectCommand({ Bucket: inputBucket, Key: inputKey }),
	)
	const inputPath = toAWSFilePath(`raw-${inputKey}`)
	const writeBodyResult = await writeBodyToFile(response.Body, inputPath)
	if (isFailure(writeBodyResult)) {
		logger.error(writeBodyResult.error)
		return writeBodyResult
	}

	const outputPath = toAWSFilePath(inputKey)
	const normaliseResult = await normaliseAudio(inputPath, outputPath)
	if (isFailure(normaliseResult)) {
		logger.error(normaliseResult.error)
		return normaliseResult
	}

	const outputKey = `${path.parse(inputKey).name}.mp3`
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

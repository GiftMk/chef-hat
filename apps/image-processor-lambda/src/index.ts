import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { resizeImage } from './resizeImage'
import { SixteenByNine } from './dimensions/AspectRatio'
import { isFailure } from '@chef-hat/ts-result'
import {
	uploadToS3,
	writeBodyToFile,
	toLambdaFilePath,
	decodeS3Key,
} from '@chef-hat/aws-utils'
import fs from 'node:fs'
import { logger } from './logger'
import path from 'node:path'
import type { S3ObjectState, ErrorState } from '@chef-hat/step-functions'

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export type InputState = {
	inputBucket: string
	inputKey: string
	outputBucket: string
}

export const handler = async (
	state: InputState,
): Promise<S3ObjectState | ErrorState> => {
	const inputBucket = state.inputBucket
	const inputKey = decodeS3Key(state.inputKey)
	const outputBucket = state.outputBucket

	const response = await s3Client.send(
		new GetObjectCommand({ Bucket: inputBucket, Key: inputKey }),
	)
	const inputPath = toLambdaFilePath(`raw-${inputKey}`)
	const writeBodyResult = await writeBodyToFile(response.Body, inputPath)
	if (isFailure(writeBodyResult)) {
		logger.error(writeBodyResult.error)
		return writeBodyResult
	}

	const outputKey = `${path.parse(inputKey).name}.png`
	const outputPath = toLambdaFilePath(outputKey)
	const resizeResult = await resizeImage(inputPath, SixteenByNine, outputPath)
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

	return { bucket: outputBucket, key: outputKey }
}

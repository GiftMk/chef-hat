import {
	StartExecutionCommand,
	type StartExecutionCommandInput,
} from '@aws-sdk/client-sfn'
import type {
	CreateVideoResponse,
	MutationCreateVideoArgs,
} from '../generated/graphql'
import type { ServerContext } from '../serverContext'
import { randomUUID } from 'node:crypto'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const createVideoResolver = async (
	_: unknown,
	args: MutationCreateVideoArgs,
	contextValue: ServerContext,
): Promise<CreateVideoResponse> => {
	const { client, createVideoArn } = contextValue.stepFunctions
	const videoKey = `${randomUUID()}.mp4`

	const input: StartExecutionCommandInput = {
		stateMachineArn: createVideoArn,
		input: JSON.stringify({
			image: {
				inputBucket: contextValue.uploadBucket,
				inputKey: args.input.imageFilename,
				outputBucket: contextValue.downloadBucket,
			},
			audio: {
				inputBucket: contextValue.uploadBucket,
				inputKey: args.input.audioFilename,
				outputBucket: contextValue.downloadBucket,
			},
			video: {
				width: 1920,
				height: 1080,
				name: videoKey,
				outputBucket: contextValue.downloadBucket,
			},
		}),
	}

	await client.send(new StartExecutionCommand(input))

	const getObjectCommand = new GetObjectCommand({
		Bucket: contextValue.downloadBucket,
		Key: videoKey,
	})

	const downloadUrl = await getSignedUrl(
		contextValue.s3Client,
		getObjectCommand,
		{
			expiresIn: 60 * 15,
		},
	)

	return { downloadUrl }
}

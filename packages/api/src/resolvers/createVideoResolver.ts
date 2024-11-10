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
import { GraphQLError } from 'graphql'

export const createVideoResolver = async (
	_: unknown,
	args: MutationCreateVideoArgs,
	contextValue: ServerContext,
): Promise<CreateVideoResponse> => {
	const { client, createVideoArn } = contextValue.stepFunctions
	const videoName = randomUUID()
	const videoKey = `${videoName}.mp4`

	const input: StartExecutionCommandInput = {
		stateMachineArn: createVideoArn,
		input: JSON.stringify({
			image: {
				inputBucket: contextValue.s3.uploadBucket,
				inputKey: args.input.imageFilename,
				outputBucket: contextValue.s3.downloadBucket,
			},
			audio: {
				inputBucket: contextValue.s3.uploadBucket,
				inputKey: args.input.audioFilename,
				outputBucket: contextValue.s3.downloadBucket,
			},
			video: {
				width: 1920,
				height: 1080,
				name: videoName,
				outputBucket: contextValue.s3.downloadBucket,
			},
		}),
	}

	const { executionArn } = await client.send(new StartExecutionCommand(input))

	if (!executionArn) {
		throw new GraphQLError('Failed to start job to create video')
	}

	const getObjectCommand = new GetObjectCommand({
		Bucket: contextValue.s3.downloadBucket,
		Key: videoKey,
	})

	const downloadUrl = await getSignedUrl(
		contextValue.s3.client,
		getObjectCommand,
		{
			expiresIn: 60 * 15,
		},
	)

	return { downloadUrl, trackingId: executionArn }
}

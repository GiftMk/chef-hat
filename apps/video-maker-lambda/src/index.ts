import {
	CreateJobCommand,
	MediaConvertClient,
} from '@aws-sdk/client-mediaconvert'
import { getMediaConvertJob } from './getMediaConvertJob'
import { logger } from './logger'
import type { InputState } from './InputState'
import type { MediaConvertConfig } from './MediaConvertConfig'
import type { S3ObjectState, ErrorState } from '@chef-hat/step-functions'

const mediaConvertClient = new MediaConvertClient({
	endpoint: process.env.MEDIA_CONVERT_ENDPOINT,
})
const MEDIA_CONVERT_QUEUE = process.env.MEDIA_CONVERT_QUEUE
const MEDIA_CONVERT_ROLE = process.env.MEDIA_CONVERT_ROLE

export const handler = async (
	state: InputState,
): Promise<S3ObjectState | ErrorState> => {
	if (!MEDIA_CONVERT_QUEUE) {
		const error = 'Could not retrieve media convert queue from environment'
		logger.error(error)
		return { error }
	}

	if (!MEDIA_CONVERT_ROLE) {
		const error = 'Could not retrieve media convert role from environment'
		logger.error(error)
		return { error }
	}

	const config: MediaConvertConfig = {
		queue: MEDIA_CONVERT_QUEUE,
		role: MEDIA_CONVERT_ROLE,
	}

	try {
		await mediaConvertClient.send(
			new CreateJobCommand(getMediaConvertJob(config, state)),
		)
	} catch (e) {
		const error =
			e instanceof Error
				? e.message
				: 'An unknown error occurred when creating media convert job'
		logger.error(error)
		return { error }
	}

	return { bucket: state.outputBucket, key: state.video.name }
}

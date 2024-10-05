import {
	CreateJobCommand,
	MediaConvertClient,
} from '@aws-sdk/client-mediaconvert'
import type { ClientContext } from 'aws-lambda'
import { getMediaConvertJob } from './getMediaConvertJob'
import { logger } from './logger'
import { getInputs } from './getInputs'

const mediaConvertClient = new MediaConvertClient({
	endpoint: process.env.MEDIA_CONVERT_ENDPOINT,
})
const MEDIA_CONVERT_QUEUE = process.env.MEDIA_CONVERT_QUEUE
const MEDIA_CONVERT_ROLE = process.env.MEDIA_CONVERT_ROLE

export const handler = async (context: ClientContext): Promise<void> => {
	logger.info(context.Custom)
	if (!MEDIA_CONVERT_QUEUE) {
		logger.error('Could not retrieve media convert queue from environment')
		return
	}

	if (!MEDIA_CONVERT_ROLE) {
		logger.error('Could not retrieve media convert role from environment')
		return
	}

	try {
		const inputs = getInputs(MEDIA_CONVERT_QUEUE, MEDIA_CONVERT_ROLE, context)
		await mediaConvertClient.send(
			new CreateJobCommand(getMediaConvertJob(inputs)),
		)
	} catch (e) {
		if (e instanceof Error) {
			logger.error(e.message)
		} else {
			logger.error('An unknown error occurred when creating media convert job')
		}
	}
}

import {
	CreateJobCommand,
	MediaConvertClient,
} from '@aws-sdk/client-mediaconvert'
import type { ClientContext } from 'aws-lambda'
import { mediaConvertJob } from './mediaConvertJob'
import { logger } from './logger'

const mediaConvertClient = new MediaConvertClient({
	endpoint: process.env.MEDIA_CONVERT_ENDPOINT,
})

export const handler = async (context: ClientContext): Promise<void> => {
	try {
		await mediaConvertClient.send(new CreateJobCommand(mediaConvertJob))
	} catch (e) {
		if (e instanceof Error) {
			logger.error(e.message)
		} else {
			logger.error('An unknown error occurred when creating media convert job')
		}
	}
}

import type { CreateJobCommandInput } from '@aws-sdk/client-mediaconvert'
import { getMediaConvertJob } from './getMediaConvertJob'
import { logger } from './logger'
import type { InputState } from './InputState'
import type { MediaConvertConfig } from './MediaConvertConfig'
import type { ErrorState } from '@chef-hat/step-functions'

const MEDIA_CONVERT_QUEUE = process.env.MEDIA_CONVERT_QUEUE
const MEDIA_CONVERT_ROLE = process.env.MEDIA_CONVERT_ROLE

export const handler = async (
	state: InputState,
): Promise<CreateJobCommandInput | ErrorState> => {
	logger.info(state)

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

	return getMediaConvertJob(config, state)
}

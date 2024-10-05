import type { ClientContext } from 'aws-lambda'
import type { MediaConvertInputs } from './MediaConvertInputs'

export const getInputs = (
	queue: string,
	role: string,
	context: ClientContext,
): MediaConvertInputs => ({
	queue: queue,
	role: role,
	videoDimensions: {
		width: context.Custom.videoDimensions.width,
		height: context.Custom.videoDimensions.height,
	},
	imageS3Path: context.Custom.imageS3Path,
	audioS3Path: context.Custom.audioS3Path,
	outputS3Path: context.Custom.outputS3Path,
})

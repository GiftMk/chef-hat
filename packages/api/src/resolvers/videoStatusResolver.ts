import { DescribeExecutionCommand } from '@aws-sdk/client-sfn'
import {
	VideoStatus,
	type QueryVideoStatusArgs,
	type VideoStatusResponse,
} from '../generated/graphql'
import type { ServerContext } from '../serverContext'

export const videoStatusResolver = async (
	_: unknown,
	args: QueryVideoStatusArgs,
	contextValue: ServerContext,
): Promise<VideoStatusResponse> => {
	const { trackingId: executionArn } = args
	const { client } = contextValue.stepFunctions
	const { status } = await client.send(
		new DescribeExecutionCommand({ executionArn }),
	)

	switch (status) {
		case 'ABORTED':
		case 'FAILED':
		case 'TIMED_OUT':
			return { status: VideoStatus.Failed }
		case 'RUNNING':
		case 'PENDING_REDRIVE':
			return { status: VideoStatus.InProgress }
		case 'SUCCEEDED':
			return { status: VideoStatus.Complete }
		default:
			return { status: undefined }
	}
}

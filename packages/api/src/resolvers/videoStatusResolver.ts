import { DescribeExecutionCommand } from '@aws-sdk/client-sfn'
import { VideoStatus, type QueryVideoStatusArgs } from '../generated/graphql'
import type { ServerContext } from '../serverContext'

export const videoStatusResolver = async (
	_: unknown,
	args: QueryVideoStatusArgs,
	contextValue: ServerContext,
): Promise<VideoStatus> => {
	const { client } = contextValue.stepFunctions
	const { status } = await client.send(
		new DescribeExecutionCommand({
			executionArn: args.trackingId,
		}),
	)

	switch (status) {
		case 'ABORTED':
		case 'FAILED':
		case 'TIMED_OUT':
			return VideoStatus.Failed
		case 'RUNNING':
		case 'PENDING_REDRIVE':
			return VideoStatus.InProgress
		case 'SUCCEEDED':
			return VideoStatus.Complete
		default:
			return VideoStatus.Failed
	}
}

import {
	DescribeExecutionCommand,
	type ExecutionStatus,
} from '@aws-sdk/client-sfn'
import {
	VideoCreationStatus,
	type QueryVideoStatusArgs,
	type VideoStatusResponse,
} from '../generated/graphql'
import type { ServerContext } from '../serverContext'

const getStatus = (executionStatus?: ExecutionStatus): VideoCreationStatus => {
	switch (executionStatus) {
		case 'ABORTED':
		case 'FAILED':
		case 'TIMED_OUT':
			return VideoCreationStatus.Failed
		case 'SUCCEEDED':
			return VideoCreationStatus.Complete
		default:
			return VideoCreationStatus.InProgress
	}
}

export const videoStatusResolver = async (
	_: unknown,
	args: QueryVideoStatusArgs,
	contextValue: ServerContext,
): Promise<VideoStatusResponse> => {
	const { trackingId: executionArn } = args
	const sfnClient = contextValue.stepFunctions.client
	const { status: executionStatus } = await sfnClient.send(
		new DescribeExecutionCommand({ executionArn }),
	)
	const status = getStatus(executionStatus)

	return { status }
}

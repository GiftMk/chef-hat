import { S3Client } from '@aws-sdk/client-s3'
import { SFNClient } from '@aws-sdk/client-sfn'

type StepFunctionsContext = {
	client: SFNClient
	createVideoArn: string
}

export type ServerContext = {
	s3Client: S3Client
	stepFunctions: StepFunctionsContext
	uploadBucket: string
	downloadBucket: string
}

export const getServerContext = async (): Promise<ServerContext> => ({
	s3Client: new S3Client({ region: 'ap-southeast-2' }),
	stepFunctions: {
		client: new SFNClient({ region: 'ap-southeast-2' }),
		createVideoArn:
			'arn:aws:states:ap-southeast-2:319715224908:stateMachine:MyStateMachine-18h2fncc0',
	},
	uploadBucket: 'cheff-hat-video-maker-inputs',
	downloadBucket: 'cheff-hat-video-maker-outputs',
})

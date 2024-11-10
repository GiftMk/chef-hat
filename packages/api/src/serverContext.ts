import { S3Client } from '@aws-sdk/client-s3'
import { SFNClient } from '@aws-sdk/client-sfn'

type StepFunctionsContext = {
	client: SFNClient
	createVideoArn: string
}

type S3Context = {
	client: S3Client
	uploadBucket: string
	downloadBucket: string
}

export type ServerContext = {
	s3: S3Context
	stepFunctions: StepFunctionsContext
}

export const getServerContext = async (): Promise<ServerContext> => ({
	s3: {
		client: new S3Client({ region: 'ap-southeast-2' }),
		uploadBucket: 'cheff-hat-video-maker-inputs',
		downloadBucket: 'cheff-hat-video-maker-outputs',
	},
	stepFunctions: {
		client: new SFNClient({ region: 'ap-southeast-2' }),
		createVideoArn:
			'arn:aws:states:ap-southeast-2:319715224908:stateMachine:MyStateMachine-18h2fncc0',
	},
})

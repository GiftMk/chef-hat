import type { S3ObjectState } from '@chef-hat/step-functions'

type VideoState = {
	width: number
	height: number
	name: string
	outputBucket: string
}

export type InputState = {
	resources: {
		image: S3ObjectState
		audio: S3ObjectState
	}
	video: VideoState
}

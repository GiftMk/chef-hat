import type { S3ObjectState } from '@chef-hat/step-functions'

type VideoSettings = {
	name: string
	width: number
	height: number
}

export type InputState = {
	image: S3ObjectState
	audio: S3ObjectState
	video: VideoSettings
	outputBucket: string
}

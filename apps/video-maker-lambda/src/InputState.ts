import type { S3ObjectState } from '@chef-hat/step-functions'

type VideoSettings = {
	width: number
	height: number
}

export type InputState = {
	resources: {
		image: S3ObjectState
		audio: S3ObjectState
	}
	video: VideoSettings & S3ObjectState
}

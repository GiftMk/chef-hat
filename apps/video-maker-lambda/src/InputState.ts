type ObjectContext = {
	bucket: string
	key: string
}

type VideoSettings = {
	name: string
	width: number
	height: number
}

export type InputState = {
	image: ObjectContext
	audio: ObjectContext
	video: VideoSettings
	outputBucket: string
}

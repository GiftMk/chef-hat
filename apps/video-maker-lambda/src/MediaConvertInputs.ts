type Dimensions = {
	width: number
	height: number
}

export type MediaConvertInputs = {
	queue: string
	role: string
	videoDimensions: Dimensions
	imageS3Path: string
	audioS3Path: string
	outputS3Path: string
}

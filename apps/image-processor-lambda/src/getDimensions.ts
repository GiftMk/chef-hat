import ffmpeg from 'fluent-ffmpeg'

export type Dimensions = {
	width: number
	height: number
}

export const getDimensions = async (
	imagePath: string,
): Promise<Dimensions | null> => {
	const data = await new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
		ffmpeg(imagePath).ffprobe((error, data) => {
			if (error) {
				reject(error)
			} else {
				return resolve(data)
			}
		})
	})

	const dataStream = data.streams[0]
	const width = dataStream?.width
	const height = dataStream?.height

	return width && height ? { width, height } : null
}

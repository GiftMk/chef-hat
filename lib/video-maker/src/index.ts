import ffmpeg from 'fluent-ffmpeg'

type VideoRequest = {
	audioPath: string
	imagePath: string
	outputPath: string
}

type VideoResponse = {
	errors: string[]
}

export const makeVideo = async ({
	audioPath,
	imagePath,
	outputPath,
}: VideoRequest): Promise<VideoResponse> => {
	const errors: string[] = []

	try {
		await new Promise<void>((resolve, reject) => {
			ffmpeg()
				.input(imagePath)
				.loop()
				.input(audioPath)
				.audioCodec('aac')
				.audioBitrate(320)
				.videoCodec('libx264')
				.outputOption('-pix_fmt', 'yuv420p')
				.outputOption('-shortest')
				.on('start', (c) =>
					console.log(`Started making video using command: ${c}`),
				)
				.on('end', () => {
					console.log('Finished making video')
					resolve()
				})
				.on('progress', ({ timemark }) =>
					console.log(`Current timestamp: ${timemark}`),
				)
				.on('error', ({ message }) => {
					console.error(message)
					errors.push(message)
					reject()
				})
				.save(outputPath)
		})
	} catch (e) {
		if (e instanceof Error) {
			errors.push(e.message)
		} else {
			errors.push('An unknown error occurred')
		}
	}

	return { errors }
}

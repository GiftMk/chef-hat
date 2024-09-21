import ffmpeg from 'fluent-ffmpeg'
import type { AspectRatio } from './aspect-ratio/AspectRatio'
import { getDimensions } from './getDimensions'

export const resizeImage = async (
	imagePath: string,
	aspectRatio: AspectRatio,
	outputPath: string,
): Promise<string[]> => {
	const errors: string[] = []
	const dimensions = await getDimensions(imagePath)
	if (!dimensions) {
		errors.push(`Failed to get dimensions for image '${imagePath}'`)
		return errors
	}
	const scaledDimensions = aspectRatio.scale(dimensions)
	if (!scaledDimensions) {
		errors.push(`Failed to scale dimensions for image '${imagePath}'`)
		return errors
	}
	const normalisedDimensions = aspectRatio.normalisedDimensions

	try {
		await new Promise<void>((resolve, reject) => {
			ffmpeg()
				.input(imagePath)
				.videoFilters([
					{
						filter: 'crop',
						options: `${scaledDimensions.width}:${scaledDimensions.height}:${scaledDimensions.width / 2}:${scaledDimensions.height / 2}`,
					},
				])
				.size(`${normalisedDimensions.width}x${normalisedDimensions.height}`)
				.on('start', (command) =>
					console.log(`Started resizing image with command ${command}`),
				)
				.on('end', () => {
					console.log('Finished resizing image')
					resolve()
				})
				.on('error', (e) => {
					console.error(e.message)
					errors.push(e.message)
					reject()
				})
				.saveToFile(outputPath)
		})
	} catch (e) {
		if (e instanceof Error) {
			errors.push(e.message)
		} else {
			errors.push(
				`An unknown error occurred while resizing image '${outputPath}'.`,
			)
		}
	}

	return errors
}

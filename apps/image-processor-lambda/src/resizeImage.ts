import ffmpeg from 'fluent-ffmpeg'
import type { AspectRatio } from './aspect-ratio/AspectRatio'
import { getDimensions } from './dimensions/getDimensions'
import { crop } from './video-filters/crop'
import { scale } from './video-filters/size'
import {
	failure,
	isFailure,
	emptySuccess,
	getValueOrThrow,
	type Result,
} from '@chef-hat/ts-result'
import { getCroppedDimensions } from './aspect-ratio/getCroppedDimensions'

export const resizeImage = async (
	imagePath: string,
	aspectRatio: AspectRatio,
	outputPath: string,
): Promise<Result> => {
	const dimensionsResult = await getDimensions(imagePath)
	if (isFailure(dimensionsResult)) return dimensionsResult

	const dimensions = getValueOrThrow(dimensionsResult)
	const croppedDimensionsResult = getCroppedDimensions(
		dimensions,
		aspectRatio.ratio,
	)

	if (isFailure(croppedDimensionsResult)) return croppedDimensionsResult
	const croppedDimensions = getValueOrThrow(croppedDimensionsResult)

	const scaledDimensions = aspectRatio.scaledDimensions

	try {
		return await new Promise<Result>((resolve, reject) => {
			ffmpeg()
				.input(imagePath)
				.videoFilters([crop(croppedDimensions), scale(scaledDimensions)])
				.on('start', (command) =>
					console.log(`Started resizing image with command ${command}`),
				)
				.on('end', () => {
					console.log('Finished resizing image')
					resolve(emptySuccess())
				})
				.on('error', (e) => {
					console.error(e.message)
					reject(failure(e.message))
				})
				.saveToFile(outputPath)
		})
	} catch (e) {
		if (e instanceof Error) {
			return failure(e.message)
		}

		return failure(
			`An unknown error occurred while resizing image '${outputPath}'`,
		)
	}
}

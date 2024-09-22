import type { AspectRatio } from './AspectRatio'
import { failure, emptySuccess, type Result } from '@chef-hat/ts-result'
import sharp from 'sharp'
import fs from 'node:fs'

export const resizeImage = async (
	imageBuffer: Buffer,
	aspectRatio: AspectRatio,
	outputPath: string,
): Promise<Result> => {
	const { width, height } = aspectRatio
	const outputStream = fs.createWriteStream(outputPath)
	sharp(imageBuffer)
		.resize(width, height)
		.png()
		.pipe(outputStream, { end: true })

	return await new Promise<Result>((resolve, reject) => {
		outputStream.on('close', () => resolve(emptySuccess()))
		outputStream.on('error', (e) => reject(failure(e.message)))
	})
}

import type { Readable } from 'node:stream'
import unzip from 'unzip-stream'
import path from 'node:path'
import fs from 'node:fs'
import { Result } from 'typescript-functional-extensions'

type UnzipStreamResponse = {
	audioPath: string
	imagePath: string
}

export const unzipStream = async (
	stream: Readable,
): Promise<Result<UnzipStreamResponse>> => {
	let audioPath: string | null = null
	let imagePath: string | null = null

	stream.pipe(unzip.Parse()).on('entry', (entry) => {
		const filePath = entry.path
		if (typeof filePath === 'string') {
			const filename = path.parse(filePath).name

			if (filename === 'img') {
				imagePath = filePath
				entry.pipe(fs.createWriteStream(imagePath))
				return
			}

			if (filename === 'audio') {
				audioPath = filePath
				entry.pipe(fs.createWriteStream(audioPath))
				return
			}
		}

		entry.autodrain()
	})

	await new Promise((resolve) => stream.on('close', resolve))

	if (audioPath && imagePath) {
		return Result.success({ audioPath, imagePath })
	}

	return Result.failure(
		`Failed to locate both the audio and image paths. Got audio path: '${audioPath}', image path: '${imagePath}'`,
	)
}

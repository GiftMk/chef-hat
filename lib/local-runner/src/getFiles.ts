import fs from 'node:fs'
import { join } from 'node:path'

type File = {
	path: string
	filename: string
}

export const getFiles = (directory: string): File[] => {
	const filenames = fs.readdirSync(directory)
	const files: File[] = []

	for (const filename of filenames) {
		const path = join(directory, filename)

		if (fs.statSync(path).isFile()) {
			files.push({ filename, path })
		}
	}

	return files
}

import { select } from '@inquirer/prompts'
import { getFiles } from './getFiles'

export const selectFile = async (
	directory: string,
	message: string,
): Promise<string> => {
	const files = getFiles(directory)

	const path = (
		await select({
			message,
			choices: files.map((file) => ({ name: file.filename, value: file.path })),
			default: files[0]?.path,
		})
	).trim()

	return path
}

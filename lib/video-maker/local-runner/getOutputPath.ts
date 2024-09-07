import { input } from '@inquirer/prompts'
import { OUTPUTS_DIRECTORY } from './constants'
import { v4 as uuidv4 } from 'uuid'
import { join } from 'node:path'

const validatePath = (path: string): string | boolean => {
	if (path.trim().length === 0) {
		return 'Path cannot be empty.'
	}
	return true
}

export const getOutputPath = async (): Promise<string> => {
	const defaultFilename = uuidv4()

	const filename = (
		await input({
			message: 'Please enter an output filename',
			validate: validatePath,
			default: `${defaultFilename}.mp4`,
		})
	).trim()

	return join(OUTPUTS_DIRECTORY, filename)
}

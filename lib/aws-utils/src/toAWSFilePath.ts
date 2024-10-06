import path from 'node:path'

export const toAWSFilePath = (filePath: string): string => {
	return path.join('tmp', filePath)
}

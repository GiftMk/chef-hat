import path from 'node:path'

export const toLambdaFilePath = (filePath: string): string => {
	return path.join('/tmp', filePath)
}

export const decodeS3Key = (key: string): string =>
	decodeURIComponent(key.replace(/\+/g, ' '))

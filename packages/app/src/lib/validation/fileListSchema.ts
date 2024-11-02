import z from 'zod'

export const fileListSchema =
	typeof window === 'undefined'
		? z.any()
		: z
				.instanceof(FileList)
				.refine((fileList) => fileList.length === 1, 'File is required.')

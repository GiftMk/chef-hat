import { z } from 'zod'
import { fileListSchema } from './fileListSchema'

export const assetsFormSchema = z.object({
	audio: fileListSchema,
	image: fileListSchema,
})

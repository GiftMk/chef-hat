import { z } from 'zod'

export const formSchema = z.object({
	audio: z.string().url(),
	image: z.string().url(),
})

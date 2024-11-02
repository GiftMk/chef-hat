'use client'

import { assetsFormSchema } from '@/lib/validation/assetsFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { uploadAssets } from '@/lib/actions/uploadAssets'
import { ImagePreview } from './ImagePreview'
import { AudioPreview } from './AudioPreview'

type FormSchema = z.infer<typeof assetsFormSchema>

interface AssetsFormProps {
	className?: string
}

const getFileUrl = (object: unknown): string | null => {
	if (typeof window !== 'undefined' && object instanceof FileList) {
		const file = object[0]
		if (file) return URL.createObjectURL(file)
	}
	return null
}

export const AssetsForm = ({ className }: AssetsFormProps) => {
	const form = useForm<FormSchema>({
		resolver: zodResolver(assetsFormSchema),
		mode: 'onSubmit',
	})
	const isLoading = form.formState.isLoading || form.formState.isSubmitting

	const audioRef = form.register('audio')
	const imageRef = form.register('image')

	const onSubmit = async (values: FormSchema) => {
		const response = await uploadAssets({
			audio: values.audio,
			image: values.image,
		})
		console.log(response)
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn('space-y-10 flex flex-col items-center', className)}
			>
				<FormField
					control={form.control}
					name="audio"
					render={() => (
						<FormItem>
							<FormLabel>Audio</FormLabel>
							<FormControl>
								<Input type="file" {...audioRef} />
							</FormControl>
							<AudioPreview audioUrl={getFileUrl(form.getValues('audio'))} />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="image"
					render={() => (
						<FormItem>
							<FormLabel>Image</FormLabel>
							<FormControl>
								<Input type="file" {...imageRef} />
							</FormControl>
							<ImagePreview imageUrl={getFileUrl(form.getValues('image'))} />
						</FormItem>
					)}
				/>
				<Button
					variant={'cta'}
					className={cn('rounded-full w-20 h-20 text-2xl')}
					disabled={isLoading}
					type="submit"
				>
					{isLoading ? 'Loading...' : 'Go!'}
				</Button>
			</form>
		</Form>
	)
}

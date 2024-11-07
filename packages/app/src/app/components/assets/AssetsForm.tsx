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
import { cn, getObjectUrl } from '@/lib/utils'
import { uploadAssets } from '@/lib/actions/uploadAssets'
import { ImagePreview } from './ImagePreview'
import { AudioPreview } from './AudioPreview'
import { toast } from 'sonner'
import { getValueOrThrow, isFailure } from '@chef-hat/ts-result'
import { useAssetsStore } from '@/hooks/useAssetsStore'
import { useEffect } from 'react'

type FormSchema = z.infer<typeof assetsFormSchema>

interface AssetsFormProps {
	className?: string
	onSubmit?: () => void
}

export const AssetsForm = ({ className, onSubmit }: AssetsFormProps) => {
	const {
		audio,
		setAudio,
		setAudioFilename,
		image,
		setImage,
		setImageFilename,
	} = useAssetsStore((state) => ({
		audio: state.audio,
		setAudio: state.setAudio,
		image: state.image,
		setImage: state.setImage,
		setAudioFilename: state.setAudioFilename,
		setImageFilename: state.setImageFilename,
	}))
	const form = useForm<FormSchema>({
		resolver: zodResolver(assetsFormSchema),
		mode: 'onSubmit',
		defaultValues: {
			audio,
			image,
		},
	})
	const isLoading = form.formState.isLoading || form.formState.isSubmitting
	const audioRef = form.register('audio')
	const imageRef = form.register('image')
	const audioInput = form.watch('audio')
	const imageInput = form.watch('image')

	useEffect(() => {
		setAudio(audioInput)
		setImage(imageInput)
	}, [audioInput, imageInput, setAudio, setImage])

	const handleSubmit = async (values: FormSchema) => {
		const uploadResult = await uploadAssets({
			audio: values.audio,
			image: values.image,
		})
		if (isFailure(uploadResult)) {
			toast.error(uploadResult.error)
			onSubmit?.()
			return
		}

		const { audioFilename, imageFilename } = getValueOrThrow(uploadResult)
		setAudioFilename(audioFilename)
		setImageFilename(imageFilename)
		toast.success('Successfully uploaded assets.')
		onSubmit?.()
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
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
							<AudioPreview audioUrl={getObjectUrl(audio)} />
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
							<ImagePreview imageUrl={getObjectUrl(image)} />
						</FormItem>
					)}
				/>
				<Button disabled={isLoading} type="submit">
					{isLoading ? 'Uploading...' : 'Upload'}
				</Button>
			</form>
		</Form>
	)
}

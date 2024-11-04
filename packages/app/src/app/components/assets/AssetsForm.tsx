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
import { toast } from 'sonner'
import { getValueOrThrow, isFailure } from '@chef-hat/ts-result'
import { createVideo } from '@/lib/actions/createVideo'
import { useVideoState } from '@/state/videoStore'

type FormSchema = z.infer<typeof assetsFormSchema>

interface AssetsFormProps {
	className?: string
	onSubmit?: () => void
}

const getFileUrl = (object: unknown): string | null => {
	if (typeof window !== 'undefined' && object instanceof FileList) {
		const file = object[0]
		if (file) return URL.createObjectURL(file)
	}
	return null
}

export const AssetsForm = ({ className, onSubmit }: AssetsFormProps) => {
	const form = useForm<FormSchema>({
		resolver: zodResolver(assetsFormSchema),
		mode: 'onSubmit',
	})
	const isLoading = form.formState.isLoading || form.formState.isSubmitting
	const audioRef = form.register('audio')
	const imageRef = form.register('image')
	const setTrackingId = useVideoState((state) => state.setTrackingId)
	const setDownloadUrl = useVideoState((state) => state.setDownloadUrl)

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

		const uploadResponse = getValueOrThrow(uploadResult)
		const createVideoResult = await createVideo(uploadResponse)

		if (isFailure(createVideoResult)) {
			toast.error(createVideoResult.error)
			onSubmit?.()
			return
		}
		const { trackingId, downloadUrl } = getValueOrThrow(createVideoResult)
		setTrackingId(trackingId)
		setDownloadUrl(downloadUrl)
		toast.success('Video creation has started!')
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
					className={cn('rounded-full w-20 h-20 text-xl font-semibold')}
					disabled={isLoading}
					type="submit"
				>
					{isLoading ? '...' : 'Go!'}
				</Button>
			</form>
		</Form>
	)
}

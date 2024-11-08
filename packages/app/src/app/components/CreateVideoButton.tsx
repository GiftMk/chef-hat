'use client'

import { Button } from '@/components/ui/button'
import { useVideoStatus } from '@/hooks/useVideoStatus'
import { createVideo } from '@/lib/actions/createVideo'
import { VideoStatus } from '@/lib/graphql/generated/graphql'
import { cn } from '@/lib/utils'
import { useVideoStore } from '@/hooks/useVideoStore'
import { getValueOrThrow, isFailure } from '@chef-hat/ts-result'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAssetsStore } from '@/hooks/useAssetsStore'

export const CreateVideoButton = () => {
	const { setTrackingId, setDownloadUrl } = useVideoStore((state) => ({
		setTrackingId: state.setTrackingId,
		setDownloadUrl: state.setDownloadUrl,
	}))
	const { audioFilename, imageFilename } = useAssetsStore((state) => ({
		audioFilename: state.audioFilename,
		imageFilename: state.audioFilename,
	}))
	const { status } = useVideoStatus()

	const [isLoading, setIsLoading] = useState(false)
	const disabled =
		!audioFilename ||
		!imageFilename ||
		isLoading ||
		status === VideoStatus.InProgress

	const handleClick = async () => {
		if (disabled) {
			return
		}

		setIsLoading(true)

		const createVideoResult = await createVideo({
			audioFilename,
			imageFilename,
		})

		if (isFailure(createVideoResult)) {
			toast.error(createVideoResult.error)
			setIsLoading(false)
			return
		}

		const { trackingId, downloadUrl } = getValueOrThrow(createVideoResult)
		setTrackingId(trackingId)
		setDownloadUrl(downloadUrl)
		toast.success('Video creation has started!')

		setIsLoading(false)
	}

	return (
		<Button
			onClick={handleClick}
			variant={'cta'}
			className={cn('rounded-full w-20 h-20 text-xl font-semibold')}
			disabled={disabled}
		>
			{isLoading ? '...' : 'Go!'}
		</Button>
	)
}

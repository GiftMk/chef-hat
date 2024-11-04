'use client'

import { Button } from '@/components/ui/button'
import { createVideo } from '@/lib/actions/createVideo'
import { cn } from '@/lib/utils'
import { useVideoState } from '@/state/videoStore'
import { getValueOrThrow, isFailure } from '@chef-hat/ts-result'
import { useState } from 'react'
import { toast } from 'sonner'

export const CreateVideoButton = () => {
	const setTrackingId = useVideoState((state) => state.setTrackingId)
	const setDownloadUrl = useVideoState((state) => state.setDownloadUrl)
	const audioFilename = useVideoState((state) => state.assets.audioFilename)
	const imageFilename = useVideoState((state) => state.assets.imageFilename)
	const [isLoading, setIsLoading] = useState(false)
	const disabled = !audioFilename || !imageFilename || isLoading

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
		setIsLoading(false)
		toast.success('Video creation has started!')
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

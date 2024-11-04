'use client'

import { useVideoStatus } from '@/hooks/useVideoStatus'
import { useVideoState } from '@/state/videoStore'
import Image from 'next/image'
import femaleChef from '@/assets/female-chef.png'
import { VideoStatus } from '@/lib/graphql/generated/graphql'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const getPlaceholderText = (status?: VideoStatus): string => {
	if (!status) {
		return `Upload your assets and hit 'Go!' to create & download your video.`
	}
	switch (status) {
		case VideoStatus.Complete:
			return 'Your video is ready for download.'
		case VideoStatus.Failed:
			return 'Something went wrong when making your video. Please try again.'
		case VideoStatus.InProgress:
			return 'Your video is cooking. This will take a few minutes.'
	}
}

export const VideoDownloader = () => {
	const trackingId = useVideoState((state) => state.trackingId)
	const setTrackingId = useVideoState((state) => state.setTrackingId)
	const downloadUrl = useVideoState((state) => state.downloadUrl)
	const { status } = useVideoStatus(trackingId, setTrackingId)

	useEffect(() => {
		if (downloadUrl && status === VideoStatus.Complete) {
			const fetchData = async () => {
				const response = await fetch(downloadUrl)
				if (response.ok) {
					const data = await response.json()
					console.log(response)
					console.log(data)
					toast.success('Successfully downloaded video')
				} else {
					toast.error('Failed to download video')
				}
			}

			fetchData()
		}
	}, [status, downloadUrl])

	return (
		<div className="shrink-0 relative rounded-md overflow-hidden aspect-video w-full flex items-end">
			{status === VideoStatus.InProgress && <LoadingOverlay />}
			{!status && <WaitingOverlay />}
			<div className="relative w-full h-full flex flex-col gap-4 items-center justify-center">
				<p className="font-medium opacity-75">{getPlaceholderText(status)}</p>
				<Image
					className={cn('relative w-16 h-16', {
						'animate-bounce': status === VideoStatus.InProgress,
					})}
					src={femaleChef}
					alt="female chef icon"
				/>
			</div>
		</div>
	)
}

const WaitingOverlay = () => {
	return <div className="absolute w-full h-full animate-pulse bg-zinc-100" />
}

const LoadingOverlay = () => {
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		const intervalHandler = setInterval(
			() => setProgress((curr) => curr + 25),
			1000,
		)
		const timeoutHandler = setTimeout(
			() => clearInterval(intervalHandler),
			5 * 60 * 1000,
		)
		return () => {
			clearInterval(intervalHandler)
			clearTimeout(timeoutHandler)
		}
	}, [])

	return (
		<div
			className={cn('bg-blue-100 transition-height duration-500', {
				'h-0': progress === 0,
				'h-1/4': progress === 25,
				'h-1/2': progress === 50,
				'h-3/4': progress === 75,
				'h-full': progress === 100,
			})}
		/>
	)
}

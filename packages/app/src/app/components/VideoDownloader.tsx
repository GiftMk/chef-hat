'use client'

import { useVideoStatus } from '@/hooks/useVideoStatus'
import { useVideoState } from '@/state/videoStore'
import Image from 'next/image'
import femaleChef from '@/assets/female-chef.png'
import { VideoStatus } from '@/lib/graphql/generated/graphql'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

const getPlaceholderText = (status?: VideoStatus): string => {
	if (!status || status === VideoStatus.Unknown) {
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
					console.log(data)
				}
			}

			fetchData()
		}
	}, [status, downloadUrl])

	return (
		<div className="shrink-0 p-8 relative rounded-md overflow-hidden aspect-video w-full flex flex-col gap-4 items-center justify-center">
			<div className="absolute h-full w-full bg-zinc-100 animate-pulse " />
			<p className="relative font-medium opacity-75">
				{getPlaceholderText(status)}
			</p>
			<Image
				className={cn('relative w-16 h-16', {
					'animate-bounce': status === VideoStatus.InProgress,
				})}
				src={femaleChef}
				alt="female chef icon"
			/>
		</div>
	)
}

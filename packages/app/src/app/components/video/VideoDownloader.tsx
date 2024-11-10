'use client'

import { useVideoStatus } from '@/hooks/useVideoStatus'
import { useVideoStore } from '@/hooks/useVideoStore'
import Image from 'next/image'
import femaleChef from '@/assets/female-chef.png'
import { VideoCreationStatus } from '@/lib/graphql/generated/graphql'
import { useEffect } from 'react'
import { cn, getObjectUrl } from '@/lib/utils'
import { toast } from 'sonner'
import { DownloadVideoButton } from './DownloadVideoButton'

const getPlaceholderText = (status?: VideoCreationStatus): string => {
	if (!status) {
		return `Upload your assets and hit 'Go!' to create & download your video.`
	}
	switch (status) {
		case VideoCreationStatus.Complete:
			return 'Your video is ready for download.'
		case VideoCreationStatus.Failed:
			return 'Something went wrong when making your video. Please try again.'
		case VideoCreationStatus.InProgress:
			return 'Your video is cooking. This can take a few minutes...'
	}
}

export const VideoDownloader = () => {
	const { downloadUrl, videoUrl, setVideoUrl } = useVideoStore((state) => ({
		downloadUrl: state.downloadUrl,
		videoUrl: state.videoUrl,
		setVideoUrl: state.setVideoUrl,
	}))
	const { status } = useVideoStatus()

	useEffect(() => {
		if (downloadUrl && status === VideoCreationStatus.Complete) {
			const fetchData = async () => {
				const response = await fetch(downloadUrl)
				if (response.ok) {
					const blob = await response.blob()
					const videoUrl = getObjectUrl(blob)
					if (videoUrl) {
						setVideoUrl(videoUrl)
						toast.success('Successfully downloaded video')
						return
					}
				}
				toast.error('Failed to download video')
			}

			fetchData()
		}
	}, [status, downloadUrl, setVideoUrl])

	if (videoUrl) {
		return (
			<div className="flex w-full items-center flex-col gap-4">
				{/* biome-ignore lint/a11y/useMediaCaption: Video is user-generated */}
				<video controls className="rounded-md w-full">
					<source src={videoUrl} type="video/mp4" />
				</video>
				<DownloadVideoButton />
			</div>
		)
	}

	return (
		<div className="shrink-0 relative rounded-md overflow-hidden aspect-video w-full flex items-end">
			<div className="absolute w-full h-full animate-pulse bg-zinc-100" />
			<div className="relative w-full h-full flex flex-col gap-4 items-center justify-center">
				<p className="font-medium opacity-75">{getPlaceholderText(status)}</p>
				<Image
					className={cn('relative w-16 h-16', {
						'animate-bounce': status === VideoCreationStatus.InProgress,
					})}
					src={femaleChef}
					alt="female chef icon"
				/>
			</div>
		</div>
	)
}

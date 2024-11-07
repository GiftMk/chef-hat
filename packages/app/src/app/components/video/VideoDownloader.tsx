'use client'

import { useVideoStatus } from '@/hooks/useVideoStatus'
import { useVideoStore } from '@/hooks/useVideoStore'
import Image from 'next/image'
import femaleChef from '@/assets/female-chef.png'
import { VideoStatus } from '@/lib/graphql/generated/graphql'
import { useEffect, useState } from 'react'
import { cn, getObjectUrl } from '@/lib/utils'
import { toast } from 'sonner'
import { DownloadVideoButton } from './DownloadVideoButton'

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
	const { downloadUrl, videoUrl, setVideoUrl } = useVideoStore((state) => ({
		downloadUrl: state.downloadUrl,
		videoUrl: state.videoUrl,
		setVideoUrl: state.setVideoUrl,
	}))
	const { status } = useVideoStatus()

	useEffect(() => {
		if (downloadUrl && status === VideoStatus.Complete) {
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
		return () => {
			clearInterval(intervalHandler)
		}
	}, [])

	return (
		<div
			className={cn(
				'absolute w-full bg-blue-100 transition-height duration-500',
				{
					'h-0': progress === 0,
					'h-1/4': progress === 25,
					'h-1/2': progress === 50,
					'h-3/4': progress === 75,
					'h-full': progress === 100,
				},
			)}
		/>
	)
}

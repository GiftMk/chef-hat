'use client'

import { Button } from '@/components/ui/button'
import { useVideoStore } from '@/hooks/useVideoStore'

export const DownloadVideoButton = () => {
	const { videoUrl, setVideoUrl } = useVideoStore((state) => ({
		videoUrl: state.videoUrl,
		setVideoUrl: state.setVideoUrl,
	}))
	const handleClick = () => {
		if (videoUrl) {
			const a = document.createElement('a')
			a.style.display = 'none'
			a.href = videoUrl
			a.setAttribute('download', 'music-video.mp4')
			document.body.appendChild(a)
			a.click()
			window.URL.revokeObjectURL(videoUrl)
			setVideoUrl(undefined)
		}
	}

	return (
		<Button onClick={handleClick} className="w-fit">
			Download
		</Button>
	)
}

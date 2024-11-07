import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

interface VideoState {
	trackingId?: string
	setTrackingId: (trackingId?: string) => void
	downloadUrl?: string
	setDownloadUrl: (downloadUrl?: string) => void
	videoUrl?: string
	setVideoUrl: (videoUrl?: string) => void
}

const useStore = create<VideoState>()((set) => ({
	setTrackingId: (trackingId) => set({ trackingId }),
	setDownloadUrl: (downloadUrl) => set({ downloadUrl }),
	setVideoUrl: (videoUrl) => set({ videoUrl }),
}))

export const useVideoStore = <T>(selector: (state: VideoState) => T) =>
	useStore(useShallow(selector))

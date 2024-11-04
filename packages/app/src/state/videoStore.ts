import { create } from 'zustand'

interface VideoState {
	trackingId?: string
	setTrackingId: (trackingId?: string) => void
	downloadUrl?: string
	setDownloadUrl: (downloadUrl?: string) => void
}

export const useVideoState = create<VideoState>()((set) => ({
	setTrackingId: (trackingId) =>
		set({
			trackingId,
		}),
	setDownloadUrl: (downloadUrl) =>
		set({
			downloadUrl,
		}),
}))

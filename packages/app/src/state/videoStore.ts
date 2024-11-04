import { create } from 'zustand'

interface VideoAssets {
	audioFilename?: string
	setAudioFilename: (audioFilename?: string) => void
	imageFilename?: string
	setImageFilename: (imageFilename?: string) => void
}

interface VideoState {
	assets: VideoAssets
	trackingId?: string
	setTrackingId: (trackingId?: string) => void
	downloadUrl?: string
	setDownloadUrl: (downloadUrl?: string) => void
}

export const useVideoState = create<VideoState>()((set) => ({
	assets: {
		setAudioFilename: (audioFilename) =>
			set((state) => ({
				...state,
				assets: { ...state.assets, audioFilename },
			})),
		setImageFilename: (imageFilename) =>
			set((state) => ({
				...state,
				assets: { ...state.assets, imageFilename },
			})),
	},
	setTrackingId: (trackingId) =>
		set({
			trackingId,
		}),
	setDownloadUrl: (downloadUrl) =>
		set({
			downloadUrl,
		}),
}))

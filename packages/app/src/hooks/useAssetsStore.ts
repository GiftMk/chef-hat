import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

interface AssetsState {
	audio?: FileList
	setAudio: (audio?: FileList) => void
	audioFilename?: string
	setAudioFilename: (audioFilename?: string) => void
	image?: FileList
	setImage: (image?: FileList) => void
	imageFilename?: string
	setImageFilename: (imageFilename?: string) => void
}

const useStore = create<AssetsState>()((set) => ({
	setAudio: (audio) => set({ audio }),
	setAudioFilename: (audioFilename) => set({ audioFilename }),
	setImage: (image) => set({ image }),
	setImageFilename: (imageFilename) => set({ imageFilename }),
}))

export const useAssetsStore = <T>(selector: (state: AssetsState) => T) =>
	useStore(useShallow(selector))

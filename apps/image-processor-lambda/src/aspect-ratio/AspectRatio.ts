import type { Dimensions } from '../dimensions/Dimensions'

export type AspectRatio = Readonly<{
	ratio: number
	scaledDimensions: Readonly<Dimensions>
}>

export const SixteenByNine: AspectRatio = {
	ratio: 16 / 9,
	scaledDimensions: {
		width: 1920,
		height: 1080,
	},
}

import type { Dimensions } from '../getDimensions'
import { AspectRatio } from './AspectRatio'

export class SixteenByNine extends AspectRatio {
	normalisedDimensions: Dimensions = { width: 1920, height: 1080 }
	protected ratio: number = 16 / 9
}

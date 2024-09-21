import type { Dimensions } from '../getDimensions'

export abstract class AspectRatio {
	protected abstract ratio: number
	abstract readonly normalisedDimensions: Dimensions

	private getScaledHeight(width: number): number {
		return width * (1 / this.ratio)
	}

	private getScaledWidth(height: number): number {
		return height * this.ratio
	}

	private isEven(value: number): boolean {
		return value % 2 === 0
	}

	scale(dimensions: Dimensions): Dimensions | null {
		const { width, height } = dimensions

		if (width < height) {
			return this.scaleFromWidth(dimensions)
		}

		return this.scaleFromHeight(dimensions)
	}

	private scaleFromWidth(dimensions: Dimensions): Dimensions | null {
		let scaledWidth = dimensions.width

		while (scaledWidth > 0) {
			const scaledHeight = this.getScaledHeight(scaledWidth)
			if (this.isEven(scaledWidth) && this.isEven(scaledHeight)) {
				return { width: scaledWidth, height: scaledHeight }
			}
			scaledWidth--
		}

		return null
	}

	private scaleFromHeight(dimensions: Dimensions): Dimensions | null {
		let scaledHeight = dimensions.height

		while (scaledHeight > 0) {
			const scaledWidth = this.getScaledWidth(scaledHeight)
			if (this.isEven(scaledWidth) && this.isEven(scaledHeight)) {
				return { width: scaledWidth, height: scaledHeight }
			}
			scaledHeight--
		}

		return null
	}
}

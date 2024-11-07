import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getObjectUrl = (object: unknown): string | null => {
	if (typeof window === 'undefined') return null

	if (object instanceof FileList) {
		const file = object[0]
		if (file) return URL.createObjectURL(file)
	}

	if (object instanceof Blob) {
		return URL.createObjectURL(object)
	}

	return null
}

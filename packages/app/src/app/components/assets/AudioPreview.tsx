import { useEffect, useRef } from 'react'

interface AudioPreviewProps {
	audioUrl: string | null
}

export const AudioPreview = ({ audioUrl }: AudioPreviewProps) => {
	if (audioUrl) {
		return (
			<div className="w-full flex justify-center">
				{/* biome-ignore lint/a11y/useMediaCaption: Audio is user uploaded */}
				<audio controls key={audioUrl}>
					<source src={audioUrl} />
				</audio>
			</div>
		)
	}
}

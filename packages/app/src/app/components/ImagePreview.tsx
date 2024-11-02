import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import Image from 'next/image'

interface ImagePreviewProps {
	imageUrl: string | null
}

export const ImagePreview = ({ imageUrl }: ImagePreviewProps) => {
	if (imageUrl) {
		return (
			<Dialog>
				<DialogTrigger className="w-full justify-center flex hover:opacity-90 transition-opacity">
					<div className="h-32 w-32 flex justify-center">
						<Image
							className="object-cover object-top rounded-md"
							src={imageUrl}
							alt="preview-of-uploaded-image"
							width={208}
							height={208}
						/>
					</div>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="hidden">Image</DialogTitle>
					</DialogHeader>
					<Image
						className="object-cover rounded-md"
						src={imageUrl}
						alt="preview-of-uploaded-image"
						width={500}
						height={500}
					/>
				</DialogContent>
			</Dialog>
		)
	}
}

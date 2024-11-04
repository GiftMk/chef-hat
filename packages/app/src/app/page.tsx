import { AssetsLibrary } from './components/assets/AssetsLibrary'
import { CreateVideoButton } from './components/CreateVideoButton'
import { Logo } from './components/Logo'
import { VideoDownloader } from './components/VideoDownloader'

export default function Home() {
	return (
		<main className="w-full h-full max-w-2xl mx-auto flex p-8 flex-col gap-8 row-start-2 items-center">
			<Logo />
			<AssetsLibrary />
			<CreateVideoButton />
			<VideoDownloader />
		</main>
	)
}

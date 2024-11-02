import { AssetsForm } from './components/AssetsForm'
import { Logo } from './components/Logo'

export default function Home() {
	return (
		<main className="w-full h-full max-w-2xl mx-auto flex p-8 flex-col gap-8 row-start-2 items-center">
			<Logo />
			<div className="w-full h-full flex gap-8">
				<AssetsForm className="w-full" />
			</div>
		</main>
	)
}

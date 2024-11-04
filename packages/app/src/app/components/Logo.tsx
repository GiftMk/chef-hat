import Image from 'next/image'
import logo from '@/assets/male-chef.png'

export const Logo = () => {
	return (
		<div className="relative">
			<div className="absolute -inset-8 bg-gradient-to-br rounded-full from-violet-200 via-red-200/20 opacity-50 blur" />
			<div className="relative flex items-center justify-center">
				<Image src={logo} alt="logo" className="w-20 h-20" />
				<h1 className="text-4xl tracking-tighter font-bold uppercase italic">
					Video Maker
				</h1>
			</div>
		</div>
	)
}

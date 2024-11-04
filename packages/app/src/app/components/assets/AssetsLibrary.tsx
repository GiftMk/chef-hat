'use client'

import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { AssetsForm } from './AssetsForm'
import { useState } from 'react'

export const AssetsLibrary = () => {
	const [isOpen, setIsOpen] = useState(false)

	const openDrawer = () => setIsOpen(true)
	const closeDrawer = () => setIsOpen(false)

	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen}>
			<DrawerTrigger asChild>
				<Button onClick={openDrawer}>Upload Assets</Button>
			</DrawerTrigger>
			<DrawerContent className="p-8">
				<DrawerHeader>
					<DrawerTitle>Assets Library</DrawerTitle>
				</DrawerHeader>
				<AssetsForm className="w-full" onSubmit={closeDrawer} />
			</DrawerContent>
		</Drawer>
	)
}

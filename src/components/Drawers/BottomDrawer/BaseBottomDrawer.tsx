import { Button, Drawer } from '@material-tailwind/react'
import React from 'react'

type DrawerProps = {
	open: boolean
	close: () => void
	children: React.ReactNode
}

const BaseBottomDrawer: React.FC<DrawerProps> = ({ open, close, children }: DrawerProps) => {
	return (
		<Drawer placement="bottom" open={open} onClose={close} className="p-4">
			{children}
		</Drawer>
	)
}

export default BaseBottomDrawer

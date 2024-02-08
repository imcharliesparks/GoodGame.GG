import { Button, Drawer } from '@material-tailwind/react'
import React from 'react'
import styles from '../../../styles/components/BottomDrawer.module.css'

type DrawerProps = {
	open: boolean
	close: () => void
	children: React.ReactNode
}

const BaseBottomDrawer: React.FC<DrawerProps> = ({ open, close, children }: DrawerProps) => {
	return (
		<Drawer id={styles.bottomDrawer} placement="bottom" open={open} onClose={close}>
			{children}
		</Drawer>
	)
}

export default BaseBottomDrawer

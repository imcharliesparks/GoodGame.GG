import { Button, Drawer } from '@material-tailwind/react'
import React from 'react'
import styles from '../../../styles/components/BottomDrawer.module.css'
import { useScrollLock } from '@/components/hooks/useScrollLock'

type DrawerProps = {
	open: boolean
	close: () => void
	children: React.ReactNode
}

const BaseBottomDrawer: React.FC<DrawerProps> = ({ open, close, children }: DrawerProps) => {
	useScrollLock()
	return (
		<Drawer id={styles.bottomDrawer} placement="bottom" open={open} onClose={close}>
			{children}
		</Drawer>
	)
}

export default BaseBottomDrawer

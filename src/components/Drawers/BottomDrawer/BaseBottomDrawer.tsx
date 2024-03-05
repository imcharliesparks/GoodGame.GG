import { Button, Drawer } from '@material-tailwind/react'
import React from 'react'
import styles from '../../../styles/components/BottomDrawer.module.css'
import { useScrollLock } from '@/components/hooks/useScrollLock'

type DrawerProps = {
	open: boolean
	close: () => void
	children: React.ReactNode
}

const BaseBottomDrawer = ({ open, close, children }: DrawerProps) => {
	// TODO: See if we can remove this once we move drawers to store
	if (!open) return <></>

	useScrollLock()
	return (
		<Drawer id={styles.bottomDrawer} placement="bottom" open={open} onClose={close}>
			{children}
		</Drawer>
	)
}

export default BaseBottomDrawer

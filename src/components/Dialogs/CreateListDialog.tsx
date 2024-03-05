import { Dialog } from '@material-tailwind/react'
import styles from '../../styles/components/DialogBase.module.css'
import React from 'react'
import { useRemoveActiveDialog, useIsDialogActive } from '../hooks/useUIEventsState'
import { DialogNames } from '@/shared/types'

const CreateListDialog = () => {
	const isDialogActive = useIsDialogActive(DialogNames.CREATE_LIST)
	const removeActiveDialog = useRemoveActiveDialog()

	return (
		<Dialog
			id={styles.dialogBase}
			size="xs"
			open={isDialogActive}
			handler={() => removeActiveDialog(DialogNames.CREATE_LIST)}
			className="max-h-full"
		>
			Create List
		</Dialog>
	)
}

export default CreateListDialog

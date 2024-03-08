import { Button, Card, CardBody, CardFooter, Dialog, IconButton, Typography } from '@material-tailwind/react'
import React from 'react'
import { useCurrentlySelectedList, useDeleteList } from '../hooks/useStateHooks'
import { useIsDialogActive, useRemoveActiveDialog } from '../hooks/useUIEventsState'
import { DialogNames } from '@/shared/types'
import styles from '../../styles/components/DialogBase.module.css'
import { useRouter } from 'next/router'

const DeleteListDialog = () => {
	const router = useRouter()
	const [listName] = useCurrentlySelectedList()
	const [isDeleteButtonLoading, setIsDeleteButtonLoading] = React.useState<boolean>(false)
	const isDialogActive = useIsDialogActive(DialogNames.DELETE_LIST)
	const deleteList = useDeleteList()
	const removeActiveDialog = useRemoveActiveDialog()

	const handleDelete = async () => {
		setIsDeleteButtonLoading(true)
		await deleteList(listName)
		setIsDeleteButtonLoading(false)
		router.replace('/app/user/lists')
	}

	return (
		<Dialog
			id={styles.dialogBase}
			size="xs"
			open={isDialogActive}
			handler={() => removeActiveDialog(DialogNames.DELETE_LIST)}
			className="bg-transparent shadow-none"
		>
			<Card className="mx-auto w-full max-w-[24rem]">
				<CardBody>
					<div className="w-full flex justify-end">
						<IconButton
							onClick={() => removeActiveDialog(DialogNames.DELETE_LIST)}
							variant="outlined"
							className="rounded-full"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
							</svg>
						</IconButton>
					</div>
					<Typography className="text-center mb-3" variant="h4" color="blue-gray">
						Are you sure?
					</Typography>
					<Typography variant="paragraph" color="blue-gray">
						This will <span className="font-bold">delete</span> your {listName} list.
					</Typography>
				</CardBody>
				<CardFooter>
					<Button
						className="flex justify-center leading-3 tracking-tight"
						loading={isDeleteButtonLoading}
						onClick={handleDelete}
						color="red"
						size="lg"
						fullWidth
					>
						Delete
					</Button>
				</CardFooter>
			</Card>
		</Dialog>
	)
}

export default DeleteListDialog

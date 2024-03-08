import { DialogNames } from '@/shared/types'
import { useRouter } from 'next/router'
import styles from '../../styles/components/DialogBase.module.css'
import React from 'react'
import { useChangeListName, useCurrentlySelectedList } from '../hooks/useStateHooks'
import { useIsDialogActive, useRemoveActiveDialog } from '../hooks/useUIEventsState'
import { Button, Dialog, Input } from '@material-tailwind/react'

const ChangeListNameDialog = () => {
	const router = useRouter()
	const [listName] = useCurrentlySelectedList()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [newListName, setNewListName] = React.useState<string>('')
	const isDialogActive = useIsDialogActive(DialogNames.CHANGE_LIST_NAME)
	const removeActiveDialog = useRemoveActiveDialog()
	const changeListName = useChangeListName()

	React.useEffect(() => {
		if (listName) {
			setNewListName(listName)
		}
	}, [listName])

	const handleChangeListName = async () => {
		setIsLoading(true)
		await changeListName(listName, newListName)
		setIsLoading(false)
		removeActiveDialog(DialogNames.CHANGE_LIST_NAME)
		router.push(`/app/user/lists/${newListName}`)
	}

	return (
		<Dialog
			id={styles.dialogBase}
			size="xs"
			open={isDialogActive}
			handler={() => removeActiveDialog(DialogNames.CHANGE_LIST_NAME)}
			className="max-h-full"
		>
			<div className="flex flex-col">
				<div className="flex flex-row justify-between border-b-2 pb-2 mb-2">
					<h4 className="text-left">Change the name of your {listName} list</h4>
					<div
						autoFocus
						onClick={() => removeActiveDialog(DialogNames.CHANGE_LIST_NAME)}
						className="cursor-pointer text-right"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</div>
				</div>
				<div className="mb-3 flex-grow">
					<Input
						value={newListName}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewListName(e.target.value)}
						autoFocus={false}
						label="List Name"
						placeholder="List Name"
						size="md"
					/>
				</div>
			</div>
			<div className="mt-auto">
				<Button
					loading={isLoading}
					disabled={!!!listName}
					onClick={handleChangeListName}
					fullWidth
					color="green"
					className="flex items-center justify-center gap-3 btn-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="h-5 w-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
						/>
					</svg>
					<span className="tracking-wide font-normal">Change List Name</span>
				</Button>
			</div>
		</Dialog>
	)
}

export default ChangeListNameDialog

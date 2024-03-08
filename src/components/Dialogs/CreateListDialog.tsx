import { Button, Dialog, Input } from '@material-tailwind/react'
import styles from '../../styles/components/DialogBase.module.css'
import React from 'react'
import { useRemoveActiveDialog, useIsDialogActive } from '../hooks/useUIEventsState'
import { DialogNames } from '@/shared/types'
import { useCreateNewList } from '../hooks/useStateHooks'

const CreateListDialog = () => {
	const isDialogActive = useIsDialogActive(DialogNames.CREATE_LIST)
	const createNewList = useCreateNewList()
	const removeActiveDialog = useRemoveActiveDialog()
	const [listName, setListName] = React.useState<string>('')
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [inputRendered, setInputRendered] = React.useState<boolean>(false)

	const handleCreateNewList = async () => {
		await createNewList(listName)
		removeActiveDialog(DialogNames.CREATE_LIST)
	}

	// NOTE: This is the hack to keep the input from auto focusing
	React.useEffect(() => {
		if (isDialogActive) {
			const timer = setTimeout(() => setInputRendered(true), 100)
			return () => clearTimeout(timer)
		} else {
			setInputRendered(false)
		}
	}, [isDialogActive])

	return (
		<Dialog
			id={styles.dialogBase}
			size="xs"
			open={isDialogActive}
			handler={() => removeActiveDialog(DialogNames.CREATE_LIST)}
			className="max-h-full"
		>
			<div className="flex flex-col">
				<div className="flex flex-row justify-between border-b-2 pb-2 mb-2">
					<h4 className="text-left">Create New List</h4>
					<div autoFocus onClick={() => removeActiveDialog(DialogNames.CREATE_LIST)} className="cursor-pointer text-right">
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
					{inputRendered && (
						<Input
							value={listName}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setListName(e.target.value)}
							autoFocus={false}
							label="List Name"
							placeholder="List Name"
							size="md"
						/>
					)}
				</div>
			</div>
			<div className="mt-auto">
				<Button
					loading={isLoading}
					disabled={!!!listName}
					onClick={handleCreateNewList}
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
					<span className="tracking-wide font-normal">Create List</span>
				</Button>
			</div>
		</Dialog>
	)
}

export default CreateListDialog

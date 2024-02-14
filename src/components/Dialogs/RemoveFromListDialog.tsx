import { ListWithOwnership, MobyGame } from '@/shared/types'
import { handleDeleteGameFromList } from '@/shared/utils'
import { Button, Card, CardBody, CardFooter, Dialog, IconButton, Typography } from '@material-tailwind/react'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction } from 'react'

type RemoteFromListDialogProps = {
	isOpen: boolean
	game: MobyGame
	listName: string
	handler: Dispatch<SetStateAction<boolean>>
	index: number
	setListsWithOwnership: (lists: ListWithOwnership[]) => void
	closeDialog: () => void
}

const RemoveFromListDialog = ({
	isOpen,
	game,
	listName,
	handler,
	index,
	setListsWithOwnership,
	closeDialog
}: RemoteFromListDialogProps) => {
	const router = useRouter()
	const [isDeleteButtonLoading, setIsDeleteButtonLoading] = React.useState<boolean>(false)
	const handleRemoveFromList = async () => {
		setIsDeleteButtonLoading(true)
		await handleDeleteGameFromList(game, listName, index, router, setListsWithOwnership)
		setIsDeleteButtonLoading(false)
		closeDialog()
	}
	return (
		<Dialog size="xs" open={isOpen} handler={handler} className="bg-transparent shadow-none">
			<Card className="mx-auto w-full max-w-[24rem]">
				<CardBody>
					<div className="w-full flex justify-end">
						<IconButton onClick={() => handler(false)} variant="outlined" className="rounded-full">
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
						This will <span className="font-bold">remove</span> {game.title} from your {listName} list.
					</Typography>
				</CardBody>
				<CardFooter>
					<Button
						className="flex justify-center leading-3 tracking-tight"
						loading={isDeleteButtonLoading}
						onClick={handleRemoveFromList}
						color="red"
						size="lg"
						fullWidth
					>
						Remove
					</Button>
				</CardFooter>
			</Card>
		</Dialog>
	)
}

export default RemoveFromListDialog

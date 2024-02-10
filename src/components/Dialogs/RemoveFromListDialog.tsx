import { XMarkIcon } from '@heroicons/react/24/solid'
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Dialog,
	IconButton,
	Typography
} from '@material-tailwind/react'
import React from 'react'

type RemoteFromListDialogProps = {
	isOpen: boolean
	gameName: string
	listName: string
	isDeleteButtonLoading: boolean
	handler: () => void
	handleRemoveFromList: () => void
}

const RemoveFromListDialog = ({
	isOpen,
	gameName,
	listName,
	isDeleteButtonLoading,
	handler,
	handleRemoveFromList
}: RemoteFromListDialogProps) => {
	return (
		<Dialog size="xs" open={isOpen} handler={handler} className="bg-transparent shadow-none">
			<Card className="mx-auto w-full max-w-[24rem]">
				<CardBody>
					<div className="w-full flex justify-end">
						<IconButton onClick={() => handler()} variant="outlined" className="rounded-full">
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
						This will <span className="font-bold">remove</span> {gameName} from your {listName} list.
					</Typography>
				</CardBody>
				<CardFooter>
					<Button
						className="flex justify-center"
						loading={isDeleteButtonLoading}
						onClick={handleRemoveFromList}
						color="red"
						size="lg"
						fullWidth={true}
					>
						Remove
					</Button>
				</CardFooter>
			</Card>
		</Dialog>
	)
}

export default RemoveFromListDialog

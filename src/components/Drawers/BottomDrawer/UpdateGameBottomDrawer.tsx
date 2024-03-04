import React from 'react'
import BaseBottomDrawer from './BaseBottomDrawer'
import Icon from 'react-icons-kit'
import { ic_close } from 'react-icons-kit/md/ic_close'
import { ic_add } from 'react-icons-kit/md/ic_add'
import { ListWithOwnership, MobyGame, StoredGame } from '@/shared/types'
import AddToListDialog from '../../Dialogs/AddToListDialog'
import { IconButton, dialog } from '@material-tailwind/react'
import { ic_bookmark_border } from 'react-icons-kit/md/ic_bookmark_border'
import { ic_done } from 'react-icons-kit/md/ic_done'
import {
	useCurrentlySelectedGame,
	useCurrentlySelectedList,
	useListsWithOwnership
} from '@/components/hooks/useStateHooks'
import RemoveFromListDialog from '@/components/Dialogs/RemoveFromListDialog'
import UpdateGameDialog from '@/components/Dialogs/UpdateGameDialog'

type DrawerProps = {
	open: boolean
	close: (isOpen?: boolean) => void
}

enum UpdateGameBottomDrawerDialogTypes {
	ADD,
	UPDATE
}

const UpdateGameBottomDrawer = ({ open, close }: DrawerProps) => {
	const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false)
	const [_, setCurrentlySelectedList] = useCurrentlySelectedList()
	const [dialogType, setDialogType] = React.useState<UpdateGameBottomDrawerDialogTypes>()
	const [selectedGame] = useCurrentlySelectedGame()
	const lists = useListsWithOwnership()(selectedGame?.game_id)
	const handleOpenDialog = (listName: string, dialogType: UpdateGameBottomDrawerDialogTypes) => {
		setIsDialogOpen(true)
		setDialogType(dialogType)
		setCurrentlySelectedList(listName)
	}

	// TODO: Allow truncating of lists names if they're too long
	// TODO: Make sure it's scrollable if it gets too tall
	// TODO: Add loading spinner
	return (
		<BaseBottomDrawer open={open} close={close}>
			<div className="h-full w-full mx-auto p-4 overflow-y-scroll">
				<div className="grid grid-cols-2 border-b-2 pb-2">
					<h4 className="text-left">Update the game on...</h4>
					<div autoFocus onClick={() => close(false)} className="cursor-pointer text-right">
						<Icon icon={ic_close} size={24} />
					</div>
				</div>
				<div>
					{/* TODO: When you rewrite this, do it in a component that can be shared */}
					{/* TODO: Add back in loading states and better icons */}
					{!lists.length ? (
						<h1>Loading...</h1>
					) : (
						lists.map((list: ListWithOwnership, i: number) => (
							<div key={`${list}_${i}`}>
								<div
									onClick={() =>
										list.hasGame
											? handleOpenDialog(list.listName, UpdateGameBottomDrawerDialogTypes.UPDATE)
											: handleOpenDialog(list.listName, UpdateGameBottomDrawerDialogTypes.ADD)
									}
									className="my-3 flex items-center justify-between"
								>
									<div>
										<p className="inline-block pl-[0.15rem]">{list.listName}</p>
									</div>
									{list.hasGame ? (
										<IconButton color="green" ripple variant="outlined" className="rounded-full">
											<Icon color="green" size={24} icon={ic_done} />
										</IconButton>
									) : (
										<IconButton ripple variant="outlined" className="rounded-full">
											<Icon size={24} icon={ic_bookmark_border} />
										</IconButton>
									)}
								</div>
							</div>
						))
					)}
				</div>
				<div onClick={() => console.log('create list')} className="grid grid-cols-2 border-t-2 pt-2 cursor-pointer">
					<h4 className="text-left">Create new list</h4>
					<div className="cursor-pointer text-right">
						<Icon icon={ic_add} size={20} />
					</div>
				</div>
			</div>
			{dialogType === UpdateGameBottomDrawerDialogTypes.ADD ? (
				<AddToListDialog isOpen={isDialogOpen} setIsDialogOpen={() => setIsDialogOpen(false)} />
			) : (
				<UpdateGameDialog isOpen={isDialogOpen} setIsDialogOpen={() => setIsDialogOpen(false)} />
			)}
		</BaseBottomDrawer>
	)
}

export default UpdateGameBottomDrawer

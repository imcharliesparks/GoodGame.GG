import React from 'react'
import BaseBottomDrawer from './BaseBottomDrawer'
import Icon from 'react-icons-kit'
import { ic_close } from 'react-icons-kit/md/ic_close'
import { ic_add } from 'react-icons-kit/md/ic_add'
import { ListWithOwnership, MobyGame, StoredGame } from '@/shared/types'
import AddToListDialog from '../../Dialogs/AddToListDialog'
import { useRouter } from 'next/router'
import { handleDeleteGameFromList } from '@/shared/utils'
import { useSortedListNamesSecondary } from '@/components/hooks/useUserLists'
import { IconButton } from '@material-tailwind/react'
import { ic_bookmark_border } from 'react-icons-kit/md/ic_bookmark_border'
import { ic_done } from 'react-icons-kit/md/ic_done'
import UpdateGameDialog from '@/components/Dialogs/UpdateGameDialog'
import RemoveGameFromListModal from '@/components/modal/RemoveGameFromListModal/RemoveGameFromListModal'
import RemoveFromListDialog from '@/components/Dialogs/RemoveFromListDialog'
import { useCurrentlySelectedGame, useListsWithOwnership } from '@/components/hooks/useStateHooks'

type DrawerProps = {
	storedGame: StoredGame
	open: boolean
	close: () => void
	// lists: ListWithOwnership[]
	// setListsWithOwnership: (lists: ListWithOwnership[]) => void
	isUpdate?: boolean
}

const GameDetailsBottomDrawer = ({ storedGame, open, close, isUpdate }: DrawerProps) => {
	const router = useRouter()
	const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false)
	const [currentlySelectedList, setCurrentlySelectedList] = React.useState<string>('')
	const [currentListIndex, setCurrentListIndex] = React.useState<number>(0)
	const [openDialog, setOpenDialog] = React.useState<string>('')
	const getListsWithOwnership = useListsWithOwnership()
	const lists = getListsWithOwnership(storedGame.game_id)
	const sortedListNames = useSortedListNamesSecondary(lists)
	const handleOpenDialog = (listName: string, index: number, dialogType = 'update') => {
		setOpenDialog(dialogType)
		setCurrentlySelectedList(listName)
		setCurrentListIndex(index)
		setIsDialogOpen(!isDialogOpen)
	}

	// TODO: Allow truncating of lists names if they're too long
	// TODO: Make sure it's scrollable if it gets too tall
	// TODO: Add loading spinner
	return (
		<BaseBottomDrawer open={open} close={close}>
			<div className="h-full w-full mx-auto p-4 overflow-y-scroll">
				<div className="grid grid-cols-2 border-b-2 pb-2">
					<h4 className="text-left">{isUpdate ? 'Update the game on...' : 'Save game to...'}</h4>
					<div autoFocus onClick={close} className="cursor-pointer text-right">
						<Icon icon={ic_close} size={24} />
					</div>
				</div>
				<div>
					{/* TODO: When you rewrite this, do it in a component that can be shared */}
					{/* TODO: Add back in loading states and better icons */}
					{!lists.length ? (
						<h1>Loading...</h1>
					) : (
						sortedListNames.map((list: ListWithOwnership, i: number) => (
							<div key={`${list}_${i}`}>
								<div
									onClick={() =>
										isUpdate && list.hasGame
											? handleOpenDialog(list.listName, i)
											: list.hasGame
											? handleOpenDialog(list.listName, i, 'delete')
											: handleOpenDialog(list.listName, i, 'add')
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
			{/* {openDialog && openDialog === 'update' ? (
				<UpdateGameDialog
					storedGame={storedGame!}
					game={game}
					isOpen={isDialogOpen}
					setIsDialogOpen={() => setIsDialogOpen(false)}
					listName={currentlySelectedList}
					index={currentListIndex}
					setListsWithOwnership={setListsWithOwnership}
				/>
			) : openDialog && openDialog === 'delete' ? (
				<RemoveFromListDialog
					game={game}
					isOpen={isDialogOpen}
					handler={setIsDialogOpen}
					closeDialog={() => setIsDialogOpen(false)}
					listName={currentlySelectedList}
					index={currentListIndex}
					setListsWithOwnership={setListsWithOwnership}
				/>
			) : (
				<AddToListDialog
					game={game}
					isOpen={isDialogOpen}
					setIsDialogOpen={() => setIsDialogOpen(false)}
					listName={currentlySelectedList}
					index={currentListIndex}
					setListsWithOwnership={setListsWithOwnership}
				/>
			)} */}
		</BaseBottomDrawer>
	)
}

export default GameDetailsBottomDrawer

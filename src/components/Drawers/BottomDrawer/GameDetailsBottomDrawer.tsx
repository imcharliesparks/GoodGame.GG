import React from 'react'
import BaseBottomDrawer from './BaseBottomDrawer'
import Icon from 'react-icons-kit'
import { ic_close } from 'react-icons-kit/md/ic_close'
import { ic_add } from 'react-icons-kit/md/ic_add'
import { buttonCheck } from 'react-icons-kit/metrize/buttonCheck'
import { blank } from 'react-icons-kit/metrize/blank'
import { GamePlayStatus, ListWithOwnership, MobyGame, Platform } from '@/shared/types'
import AddToListDialog from '../../Dialogs/AddToListDialog'
import { Router, useRouter } from 'next/router'
import { ListStylesType } from '@material-tailwind/react'
import { handleDeleteGameFromList } from '@/shared/utils'

type DrawerProps = {
	game: MobyGame
	open: boolean
	close: () => void
	lists: ListWithOwnership[]
	setListsWithOwnership: (lists: ListWithOwnership[]) => void
}

const GameDetailsBottomDrawer = ({ game, open, close, lists, setListsWithOwnership }: DrawerProps) => {
	const router = useRouter()
	const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false)
	const [currentlySelectedList, setCurrentlySelectedList] = React.useState<string>('')
	const [currentListIndex, setCurrentListIndex] = React.useState<number>(0)
	const handleOpenDialog = (listName: string, index: number) => {
		setCurrentlySelectedList(listName)
		setCurrentListIndex(index)
		setIsDialogOpen(!isDialogOpen)
	}

	// TODO: Allow truncating of lists names if they're too long
	// TODO: Make sure it's scrollable if it gets too tall
	return (
		<BaseBottomDrawer open={open} close={close}>
			<div className="h-full w-full mx-auto p-4">
				<div className="grid grid-cols-2 border-b-2 pb-2">
					<h4 className="text-left">Save game to...</h4>
					<div autoFocus onClick={close} className="cursor-pointer text-right">
						<Icon icon={ic_close} size={24} />
					</div>
				</div>
				<div>
					{/* TODO: When you rewrite this, do it in a component that can be shared */}
					{!lists.length ? (
						<h1>Loading...</h1>
					) : (
						lists.map((list: ListWithOwnership, i: number) => (
							<div key={`${list}_${i}`}>
								<div className="my-3 flex items-center justify-between">
									<div>
										<Icon
											className={`${list.hasGame ? `text-green-600` : ''} mr-2`}
											icon={list.hasGame ? buttonCheck : blank}
											size={26}
										/>
										<p className="inline-block pl-[0.15rem]">{list.listName}</p>
									</div>
									<button
										onClick={() =>
											list.hasGame
												? handleDeleteGameFromList(list.listName, i, router, setListsWithOwnership)
												: handleOpenDialog(list.listName, i)
										}
										className={`btn btn-link normal-case text-slate-600`}
									>
										{list.hasGame ? 'Remove' : 'Add'}
									</button>
									{/* TODO: Add back in loading states and better icons */}
									{/* {buttonLoadingStates[i] ? (
										<button className="btn btn-link normal-case text-slate-600">
											{' '}
											<span className="loading loading-spinner"></span>
											loading...
										</button>
									) : (
										<button
											onClick={() =>
												list.hasGame ? handleDeleteGameFromList(list.listName, i) : handleOpenSecondaryModal(true, list.listName, i)
											}
											className={`btn btn-link normal-case text-slate-600`}
										>
											{list.hasGame ? 'Remove' : 'Add'}
										</button>
									)} */}
								</div>
							</div>
						))
					)}
				</div>
				<div onClick={() => console.log('create list')} className="grid grid-cols-2 border-t-2 pt-2 cursor-pointer">
					<h4 className="text-left">Create new list</h4>
					<div className="cursor-pointer text-right">
						<Icon icon={ic_add} size={24} />
					</div>
				</div>
			</div>
			<AddToListDialog
				game={game}
				isOpen={isDialogOpen}
				setIsDialogOpen={() => setIsDialogOpen(!isDialogOpen)}
				listName={currentlySelectedList}
				index={currentListIndex}
			/>
		</BaseBottomDrawer>
	)
}

export default GameDetailsBottomDrawer

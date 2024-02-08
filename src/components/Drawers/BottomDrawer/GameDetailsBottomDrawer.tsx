import React from 'react'
import BaseBottomDrawer from './BaseBottomDrawer'
import Icon from 'react-icons-kit'
import { ic_close } from 'react-icons-kit/md/ic_close'
import { ic_add } from 'react-icons-kit/md/ic_add'
import { buttonCheck } from 'react-icons-kit/metrize/buttonCheck'
import { blank } from 'react-icons-kit/metrize/blank'
import { GamePlayStatus, ListWithOwnership, MobyGame, Platform } from '@/shared/types'
import BottomDrawerDialog from './BottomDrawerDialog'

type DrawerProps = {
	game: MobyGame
	open: boolean
	close: () => void
	lists: ListWithOwnership[]
	handleAddGameToList: (
		game: MobyGame,
		listName: string,
		index: number,
		playStatus: Record<any, any>,
		platforms: Platform[]
	) => Promise<boolean>
	handleDeleteGameFromList: (listName: string, index: number) => Promise<boolean>
}

const GameDetailsBottomDrawer = ({
	game,
	open,
	close,
	lists,
	handleAddGameToList,
	handleDeleteGameFromList
}: DrawerProps) => {
	const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false)
	const [currentlySelectedList, setCurrentlySelectedList] = React.useState<string>('')
	const [currentListIndex, setCurrentListIndex] = React.useState<number>(0)
	const handleOpenDialog = (listName: string, index: number) => {
		setCurrentlySelectedList(listName)
		setCurrentListIndex(index)
		setIsDialogOpen(!isDialogOpen)
	}

	return (
		<BaseBottomDrawer open={open} close={close}>
			<div className="h-full w-full mx-auto">
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
											list.hasGame ? handleDeleteGameFromList(list.listName, i) : handleOpenDialog(list.listName, i)
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
			<BottomDrawerDialog
				game={game}
				isOpen={isDialogOpen}
				setIsDialogOpen={() => setIsDialogOpen(!isDialogOpen)}
				handleAddGameToList={handleAddGameToList}
				listName={currentlySelectedList}
				index={currentListIndex}
			/>
		</BaseBottomDrawer>
	)
}

export default GameDetailsBottomDrawer

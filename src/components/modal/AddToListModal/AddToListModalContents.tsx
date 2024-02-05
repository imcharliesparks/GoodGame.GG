import { GamePlayStatus, ListWithOwnership, Platform } from '@/shared/types'
import React from 'react'
import Icon from 'react-icons-kit'
import { ic_close } from 'react-icons-kit/md/ic_close'
import { ic_add } from 'react-icons-kit/md/ic_add'
import { buttonCheck } from 'react-icons-kit/metrize/buttonCheck'
import { blank } from 'react-icons-kit/metrize/blank'
import SecondaryAddToListModal from '../SecondaryAddToListModal/SecondaryAddToListModal'

type AddToListModalContentsProps = {
	setIsModalOpen: (isModalOpen: boolean) => void
	lists: ListWithOwnership[]
	handleAddGameToList: (
		listName: string,
		index: number,
		gameplayStatus: GamePlayStatus,
		platforms: Platform[]
	) => Promise<boolean>
	handleDeleteGameFromList: (listName: string, index: number) => Promise<boolean>
}

// TODO: Implement make loading pretty tbh
// TODO: Consider adding click to whole element on list
// TODO: Implement create list
const AddToListModalContents = ({
	setIsModalOpen,
	lists,
	handleAddGameToList,
	handleDeleteGameFromList
}: AddToListModalContentsProps) => {
	const [buttonLoadingStates, setButtonLoadingStates] = React.useState<boolean[]>(lists.map((list) => list.hasGame))
	const [isSecondaryModalOpen, setIsSecondaryModalOpen] = React.useState<boolean>(false)
	const [selectedList, setSelectedList] = React.useState<string>('')
	const [selectedIndex, setSelectedIndex] = React.useState<number>()

	const handleOpenSecondaryModal = (isOpen: boolean, list: string, index: number) => {
		if (isOpen) {
			setSelectedList(list)
			setSelectedIndex(index)
			setIsSecondaryModalOpen(true)
		} else {
			setIsSecondaryModalOpen(false)
		}
	}

	const handleFinalAddGameToList = async (
		listName: string,
		index: number,
		gameplayStatus: GamePlayStatus,
		platforms: Platform[]
	) => {
		const result = await handleAddGameToList(listName, index, gameplayStatus, platforms)
		setButtonLoadingStates((prev: boolean[]) => {
			const updated = Array.from(prev)
			updated[index] = false
			return updated
		})

		if (result) {
			setIsSecondaryModalOpen(false)
			setIsModalOpen(false)
		}

		return result
	}

	return (
		<div className="h-full w-[250px] mx-auto">
			<div className="grid grid-cols-2 border-b-2 pb-2">
				<h4 className="text-left">Save game to...</h4>
				<div autoFocus onClick={() => setIsModalOpen(false)} className="cursor-pointer text-right">
					<Icon icon={ic_close} size={24} />
				</div>
			</div>
			<div>
				{!lists.length ? (
					<h1>Loading...</h1>
				) : (
					lists.map((list: ListWithOwnership, i: number) => (
						<div key={`${list.listName}_${i}`}>
							<div className="my-3 flex items-center justify-between">
								<div>
									<Icon
										className={`${list.hasGame ? `text-green-600` : ''} mr-2`}
										icon={list.hasGame ? buttonCheck : blank}
										size={26}
									/>
									<p className="inline-block pl-[0.15rem]">{list.listName}</p>
								</div>
								{buttonLoadingStates[i] ? (
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
								)}
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
			{isSecondaryModalOpen && (
				<SecondaryAddToListModal
					isModalOpen={isSecondaryModalOpen}
					handleAddGameToList={handleFinalAddGameToList}
					setIsModalOpen={() => setIsSecondaryModalOpen(false)}
					listName={selectedList}
					index={selectedIndex!}
				/>
			)}
		</div>
	)
}

export default AddToListModalContents

import React from 'react'
import BaseModal from '../BaseModal'
import SecondaryAddToListModalContents from './SecondaryInfoAddToListDialogContents'
import { GamePlayStatus, ListWithOwnership, Platform } from '@/shared/types'

type SecondaryInfoAddToListDialogProps = {
	isModalOpen: boolean
	setIsModalOpen: (isModalOpen: boolean) => void
	handleAddGameToList: (
		listName: string,
		index: number,
		gameplayStatus: GamePlayStatus,
		platforms: Platform[]
	) => Promise<boolean>
	listName: string
	index: number
}

const SecondaryInfoAddToListDialog = ({
	setIsModalOpen,
	handleAddGameToList,
	listName,
	index
}: // platforms
SecondaryInfoAddToListDialogProps) => {
	const gameInLocalStorage = localStorage.getItem('currentlySelectedGame')
	const currentlySelectedGame = gameInLocalStorage ? JSON.parse(gameInLocalStorage) : null
	return (
		<div className="fixed top-[30px] left-[30px] w-full h-full bg-white">
			<SecondaryAddToListModalContents
				handleAddGameToList={handleAddGameToList}
				platforms={currentlySelectedGame.platforms!}
				setIsModalOpen={setIsModalOpen}
				listName={listName}
				index={index}
			/>
		</div>
	)
}

export default SecondaryInfoAddToListDialog

import React from 'react'
import BaseModal from '../BaseModal'
import SecondaryAddToListModalContents from './SecondaryAddToListModalContents'
import { GamePlayStatus, ListWithOwnership, Platform } from '@/shared/types'

type SecondaryAddToListModalProps = {
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

const SecondaryAddToListModal = ({
	setIsModalOpen,
	handleAddGameToList,
	listName,
	index
}: // platforms
SecondaryAddToListModalProps) => {
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

export default SecondaryAddToListModal

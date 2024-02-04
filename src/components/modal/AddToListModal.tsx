import React from 'react'
import BaseModal from './BaseModal'
import AddToListModalContents from './AddToListModalContents'
import { GamePlayStatus, ListWithOwnership, Platform } from '@/shared/types'

type AddToListModalProps = {
	isModalOpen: boolean
	lists: ListWithOwnership[]
	setIsModalOpen: (isModalOpen: boolean) => void
	handleAddGameToList: (
		listName: string,
		index: number,
		gameplayStatus: GamePlayStatus,
		platforms: Platform[]
	) => Promise<boolean>
}

const AddToListModal = ({ isModalOpen, setIsModalOpen, lists, handleAddGameToList }: AddToListModalProps) => {
	return (
		<BaseModal
			id="addToListModal"
			open={isModalOpen}
			onClose={() => {
				localStorage.removeItem('currentlySelectedGame')
				setIsModalOpen(false)
			}}
		>
			<AddToListModalContents handleAddGameToList={handleAddGameToList} lists={lists} setIsModalOpen={setIsModalOpen} />
		</BaseModal>
	)
}

export default AddToListModal

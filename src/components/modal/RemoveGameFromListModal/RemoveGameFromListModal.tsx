import React from 'react'
import BaseModal from '../BaseModal'
import { StoredGame } from '@/shared/types'
import RemoveGameFromListModalContents from './RemoveGameFromListModalContents'

type RemoveGameFromListModalProps = {
	game: StoredGame
	isModalOpen: boolean
	closeModal: () => void
	listName: string
	removeGame: () => void
	isDeleteButtonLoading: boolean
}

const RemoveGameFromListModal = ({
	game,
	isModalOpen,
	closeModal,
	listName,
	removeGame,
	isDeleteButtonLoading
}: RemoveGameFromListModalProps) => {
	return (
		<BaseModal
			id="addToListModal"
			open={isModalOpen}
			onClose={() => {
				localStorage.removeItem('currentlySelectedGame')
				closeModal
			}}
		>
			<RemoveGameFromListModalContents
				removeGame={removeGame}
				game={game}
				closeModal={closeModal}
				listName={listName}
				isModalOpen={isModalOpen}
				isDeleteButtonLoading={isDeleteButtonLoading}
			/>
		</BaseModal>
	)
}

export default RemoveGameFromListModal

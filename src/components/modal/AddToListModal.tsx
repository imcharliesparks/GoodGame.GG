import React from 'react'
import BaseModal from './BaseModal'
import AddToListModalContents from './AddToListModalContents'
import { GGLists, ListWithOwnership, MobyGame } from '@/shared/types'

type AddToListModalProps = {
	isModalOpen: boolean
	lists: ListWithOwnership[]
	setIsModalOpen: (isModalOpen: boolean) => void
	handleAddGameToList: (list: string) => Promise<boolean>
}

const AddToListModal = ({ isModalOpen, setIsModalOpen, lists, handleAddGameToList }: AddToListModalProps) => {
	return (
		<BaseModal id="modal" open={isModalOpen} onClose={() => setIsModalOpen(false)}>
			<AddToListModalContents handleAddGameToList={handleAddGameToList} lists={lists} setIsModalOpen={setIsModalOpen} />
		</BaseModal>
	)
}

export default AddToListModal

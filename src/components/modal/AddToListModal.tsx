import React from 'react'
import BaseModal from './BaseModal'
import AddToListModalContents from './AddToListModalContents'
import { GGLists, ListWithOwnership } from '@/shared/types'

type AddToListModalProps = {
	isModalOpen: boolean
	lists: ListWithOwnership[]
	isListLoading: boolean
	setIsModalOpen: (isModalOpen: boolean) => void
}

const AddToListModal = ({ isModalOpen, setIsModalOpen, lists, isListLoading }: AddToListModalProps) => {
	return (
		<BaseModal id="modal" open={isModalOpen} onClose={() => setIsModalOpen(false)}>
			<AddToListModalContents isListLoading={isListLoading} lists={lists} setIsModalOpen={setIsModalOpen} />
		</BaseModal>
	)
}

export default AddToListModal

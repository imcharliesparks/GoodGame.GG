import React from 'react'
import BaseModal from './BaseModal'
import AddToListModalContents from './AddToListModalContents'

type AddToListModalProps = {
	isModalOpen: boolean
	setIsModalOpen: (isModalOpen: boolean) => void
}

const AddToListModal = ({ isModalOpen, setIsModalOpen }: AddToListModalProps) => {
	return (
		<BaseModal id="modal" open={!isModalOpen} onClose={() => setIsModalOpen(false)}>
			<AddToListModalContents setIsModalOpen={setIsModalOpen} />
		</BaseModal>
	)
}

export default AddToListModal

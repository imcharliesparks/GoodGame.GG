import React from 'react'
import Icon from 'react-icons-kit'
import { ic_close } from 'react-icons-kit/md/ic_close'

type AddToListModalContentsProps = {
	setIsModalOpen: (isModalOpen: boolean) => void
}

const AddToListModalContents = ({ setIsModalOpen }: AddToListModalContentsProps) => {
	return (
		<div className="h-full w-[250px] mx-auto">
			<div className="grid grid-cols-2 border-b-2 pb-2">
				<h4 className="text-left">Save game to...</h4>
				<div onClick={() => setIsModalOpen(false)} className="cursor-pointer text-right">
					<Icon icon={ic_close} size={24} />
				</div>
			</div>
			<div></div>
			<div></div>
		</div>
	)
}

export default AddToListModalContents

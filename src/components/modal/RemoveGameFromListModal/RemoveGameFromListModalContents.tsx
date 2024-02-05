import { ListWithOwnership, StoredGame } from '@/shared/types'
import React from 'react'
import Icon from 'react-icons-kit'
import { ic_close } from 'react-icons-kit/md/ic_close'
import LoadingSpinner from '../../general/LoadingSpinner'

type RemoveGameFromListModalProps = {
	game: StoredGame
	isModalOpen: boolean
	closeModal: () => void
	listName: string
	removeGame: () => void
	isDeleteButtonLoading: boolean
}

const RemoveGameFromListModalContents = ({
	game,
	closeModal,
	listName,
	removeGame,
	isDeleteButtonLoading
}: RemoveGameFromListModalProps) => {
	return (
		<div className="h-full w-[250px] mx-auto max-w-[265px]">
			<div className="grid grid-cols-2 border-b-2 pb-2">
				<h4 className="text-left">Are you sure?</h4>
				<div autoFocus onClick={closeModal} className="cursor-pointer text-right">
					<Icon icon={ic_close} size={24} />
				</div>
			</div>
			<div>
				<div className="max-w-[200px] mt-6">
					<p style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'break-spaces' }}>
						This will remove {game.title} from your {listName} list.
					</p>
					<p>Proceed?</p>
				</div>
				<div className="mt-6">
					<button onClick={removeGame} className="btn btn-error btn-wide btn-md btn-outline">
						{isDeleteButtonLoading ? <LoadingSpinner /> : 'DELETE'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default RemoveGameFromListModalContents

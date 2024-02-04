import { ListWithOwnership } from '@/shared/types'
import React from 'react'
import Icon from 'react-icons-kit'
import { ic_close } from 'react-icons-kit/md/ic_close'
import { ic_add } from 'react-icons-kit/md/ic_add'
import { buttonCheck } from 'react-icons-kit/metrize/buttonCheck'
import { blank } from 'react-icons-kit/metrize/blank'

type AddToListModalContentsProps = {
	setIsModalOpen: (isModalOpen: boolean) => void
	lists: ListWithOwnership[]
	handleAddGameToList: (listName: string, index: number) => Promise<boolean>
}

// TODO: Implement make loading pretty tbh
// TODO: Consider adding click to whole element on list
// TODO: Implement create list
const AddToListModalContents = ({ setIsModalOpen, lists, handleAddGameToList }: AddToListModalContentsProps) => {
	const [buttonLoadingStates, setButtonLoadingStates] = React.useState<boolean[]>(lists.map((list) => list.hasGame))

	const handleCheckboxClick = async (listName: string, index: number) => {
		setButtonLoadingStates((prev: boolean[]) => {
			const updated = Array.from(prev)
			updated[index] = true
			return updated
		})

		const result = await handleAddGameToList(listName, index)

		setButtonLoadingStates((prev: boolean[]) => {
			const updated = Array.from(prev)
			updated[index] = false
			return updated
		})
	}

	return (
		<div className="h-full w-[250px] mx-auto">
			<div className="grid grid-cols-2 border-b-2 pb-2">
				<h4 className="text-left">Save game to...</h4>
				<div onClick={() => setIsModalOpen(false)} className="cursor-pointer text-right">
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
										onClick={() => handleCheckboxClick(list.listName, i)}
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
		</div>
	)
}

export default AddToListModalContents

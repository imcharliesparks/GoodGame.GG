import { APIMethods, GamePlayStatus, ListWithOwnership, MobyGame, StoredGame } from '@/shared/types'
import React from 'react'
import Icon from 'react-icons-kit'
import { ic_close } from 'react-icons-kit/md/ic_close'

type AddToListModalContentsProps = {
	setIsModalOpen: (isModalOpen: boolean) => void
	lists: ListWithOwnership[]
	handleAddGameToList: (list: string) => Promise<boolean>
}

// TODO: Implement loading
// TODO: Implement search to be URL encoded
const AddToListModalContents = ({ setIsModalOpen, lists, handleAddGameToList }: AddToListModalContentsProps) => {
	const [checkboxStates, setCheckBoxStates] = React.useState<boolean[]>(lists.map((list) => list.hasGame))
	const [addToListLoading, setAddToListLoading] = React.useState<boolean>(false)

	const handleCheckboxClick = async (index: number, list: string) => {
		setAddToListLoading(true)

		// setCheckBoxStates((currentCheckedStates) =>
		// 	currentCheckedStates!.map((checked, i) => (i === index ? !checked : checked))
		// )

		const result = await handleAddGameToList(list)

		// if (result) {
		// 	lists[i]
		// }

		setAddToListLoading(false)
	}

	return (
		<div className="h-full w-[250px] mx-auto">
			<div className="grid grid-cols-2 border-b-2 pb-2">
				<h4 className="text-left">Save game to...</h4>
				<div onClick={() => setIsModalOpen(false)} className="cursor-pointer text-right">
					{/* TODO: Fix this bs <Icon icon={ic_close} size={24} /> */}X
				</div>
			</div>
			<div>
				{!lists.length ? (
					<h1>Loading...</h1>
				) : (
					lists.map((list: ListWithOwnership, i: number) => (
						<div key={`${list.listName}_${i}`}>
							<div className="my-3 min-h-[1.5rem] pl-[1.5rem] flex items-center">
								<input
									className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
									type="checkbox"
									id={`${list.listName}_${i}`}
									onChange={() => {
										handleCheckboxClick(i, list.listName)
									}}
									checked={list.hasGame}
								/>
								<label className="inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor={`${list.listName}_${i}`}>
									{list.listName}
								</label>
							</div>
						</div>
					))
				)}
			</div>
			<div></div>
		</div>
	)
}

export default AddToListModalContents

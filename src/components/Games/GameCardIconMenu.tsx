import { IconButton, Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react'
import React from 'react'
import styles from '../../styles/components/NewGameCard.module.css'
import { MobyGame, StoredGame } from '@/shared/types'
import { useCurrentlySelectedList } from '../hooks/useStateHooks'

type GameCardIconMenuProps = {
	game: StoredGame | MobyGame
	listName: string
	openRemoveFromListDialog: () => void
	setGameAndOpenUpdateDialog: () => void
}

const GameCardIconMenu = ({
	listName,
	openRemoveFromListDialog,
	setGameAndOpenUpdateDialog
}: GameCardIconMenuProps) => {
	const [_, setCurrentlySelectedList] = useCurrentlySelectedList()
	const handleRemoveClick = () => {
		setCurrentlySelectedList(listName)
		openRemoveFromListDialog()
	}
	const handleUpdateClick = () => {
		setCurrentlySelectedList(listName)
		setGameAndOpenUpdateDialog()
	}

	return (
		<Menu placement="bottom-end">
			<MenuHandler id={styles.menuHandler}>
				<IconButton
					id={styles.contextButton}
					onClick={() => console.log('howdy')}
					size="sm"
					variant="gradient"
					className="rounded-full absolute top-1 right-1 z-1"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
						/>
					</svg>
				</IconButton>
			</MenuHandler>
			<MenuList>
				{/* TODO: Consider making this a modal instead */}
				{/* <MenuItem onClick={setGameAndOpenUpdateDialog}>Update</MenuItem> */}
				<MenuItem onClick={handleUpdateClick}>Update</MenuItem>
				<MenuItem onClick={handleRemoveClick}>Remove from List</MenuItem>
			</MenuList>
		</Menu>
	)
}

export default GameCardIconMenu

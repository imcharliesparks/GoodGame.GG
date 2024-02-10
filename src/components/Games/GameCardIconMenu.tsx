import { IconButton, Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react'
import React from 'react'
import styles from '../../styles/components/NewGameCard.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { StoredGame } from '@/shared/types'

type GameCardIconMenuProps = {
	game: StoredGame
	openRemoveFromListDialog: () => void
}

const GameCardIconMenu = ({ game, openRemoveFromListDialog }: GameCardIconMenuProps) => {
	const router = useRouter()

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
				{/* Take you to an update game by id page */}
				<MenuItem onClick={() => router.push(`/app/games/${game.game_id}/update`)}>Update</MenuItem>
				{/* Displays remove dialog */}
				<MenuItem onClick={openRemoveFromListDialog}>Remove from List</MenuItem>
			</MenuList>
		</Menu>
	)
}

export default GameCardIconMenu

import { Menu, MenuHandler, IconButton, MenuList, MenuItem } from '@material-tailwind/react'
import React from 'react'
// TODO: Move these to their own set of styles
import styles from '../../styles/components/NewGameCard.module.css'

const ListContextMenu = () => {
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
				<MenuItem onClick={() => console.log('boo')}>Change List Name</MenuItem>
				<MenuItem onClick={() => console.log('boo')}>Delete List</MenuItem>
			</MenuList>
		</Menu>
	)
}

export default ListContextMenu

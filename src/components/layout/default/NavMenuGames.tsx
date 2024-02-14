import { MenuItem } from '@material-tailwind/react'
import React from 'react'
import NavMenu from './NavMenu'
import Link from 'next/link'
import { useRouter } from 'next/router'

const NavMenuGames = () => {
	const router = useRouter()

	return (
		<NavMenu menuHandlerText="Games">
			<MenuItem onClick={() => router.replace('/app/user/lists/Collection')}>My Games</MenuItem>
			<hr className="my-3" />
			<MenuItem onClick={() => router.replace('/app/games')}>Discover</MenuItem>
			<MenuItem onClick={() => router.replace('/app/search/games')}>Find a Game</MenuItem>
		</NavMenu>
	)
}

export default NavMenuGames

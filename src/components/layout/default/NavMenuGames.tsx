import { MenuItem } from '@material-tailwind/react'
import React from 'react'
import NavMenu from './NavMenu'
import Link from 'next/link'
import { useRouter } from 'next/router'

const NavMenuGames = () => {
	const router = useRouter()

	return (
		<NavMenu menuHandlerText="Games">
			<MenuItem onClick={() => router.push('/app/user/lists/Collection')}>My Games</MenuItem>
			<hr className="my-3" />
			{/* TODO: Reinstate in next update */}
			{/* <MenuItem onClick={() => router.push('/app/games')}>Discover</MenuItem> */}
			<MenuItem onClick={() => router.push('/app/search/games')}>Find a Game</MenuItem>
		</NavMenu>
	)
}

export default NavMenuGames

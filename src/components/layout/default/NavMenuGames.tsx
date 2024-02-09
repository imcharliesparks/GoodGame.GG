import { MenuItem } from '@material-tailwind/react'
import React from 'react'
import NavMenu from './NavMenu'
import Link from 'next/link'

const NavMenuGames = () => (
	<NavMenu menuHandlerText="Games">
		<MenuItem>
			<Link href="/app/user/lists/Collection">My Games</Link>
		</MenuItem>
		<hr className="my-3" />
		<MenuItem>
			<Link href="/app/games/discover">Discover</Link>
		</MenuItem>
		<MenuItem>
			<Link href="/app/search/games">Search</Link>
		</MenuItem>
	</NavMenu>
)

export default NavMenuGames

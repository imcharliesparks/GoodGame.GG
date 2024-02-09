import { MenuItem } from '@material-tailwind/react'
import React from 'react'
import NavMenu from './NavMenu'
import Link from 'next/link'

const NavMenuLists = () => (
	<NavMenu menuHandlerText="Lists">
		<MenuItem>
			<Link href="/app/user/lists">My Lists</Link>
		</MenuItem>
		<hr className="my-3" />
		<MenuItem>
			<Link href="/app/user/lists/Collection">Collection</Link>
		</MenuItem>
		<MenuItem>
			<Link href="/app/user/lists/Wishlist">Wishlist</Link>
		</MenuItem>
		<MenuItem>
			<Link href="/app/user/lists/Backlog">Backlog</Link>
		</MenuItem>
		<MenuItem>
			<Link href="/app/user/lists/shared">Shared Lists</Link>
		</MenuItem>
	</NavMenu>
)

export default NavMenuLists

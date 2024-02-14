import { MenuItem } from '@material-tailwind/react'
import React from 'react'
import NavMenu from './NavMenu'
import Link from 'next/link'
import { useRouter } from 'next/router'

const NavMenuLists = () => {
	const router = useRouter()

	return (
		<NavMenu menuHandlerText="Lists">
			<MenuItem onClick={() => router.replace('/app/user/lists')}>My Lists</MenuItem>
			<hr className="my-3" />
			<MenuItem onClick={() => router.replace('/app/user/lists/Collection')}>Collection</MenuItem>
			<MenuItem onClick={() => router.replace('/app/user/lists/Wishlist')}>Wishlist</MenuItem>
			<MenuItem onClick={() => router.replace('/app/user/lists/Backlog')}>Backlog</MenuItem>
			<MenuItem onClick={() => router.replace('/app/user/lists/Shared')}>Shared</MenuItem>
		</NavMenu>
	)
}

export default NavMenuLists

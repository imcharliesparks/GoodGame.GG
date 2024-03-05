import { MenuItem } from '@material-tailwind/react'
import React from 'react'
import NavMenu from './NavMenu'
import { useRouter } from 'next/router'

// TODO?: Modify so this shows all lists
const NavMenuLists = () => {
	const router = useRouter()

	return (
		<NavMenu menuHandlerText="Lists">
			<MenuItem onClick={() => router.push('/app/user/lists')}>My Lists</MenuItem>
			<hr className="my-3" />
			<MenuItem onClick={() => router.push('/app/user/lists/Collection')}>Collection</MenuItem>
			<MenuItem onClick={() => router.push('/app/user/lists/Wishlist')}>Wishlist</MenuItem>
			<MenuItem onClick={() => router.push('/app/user/lists/Backlog')}>Backlog</MenuItem>
			<MenuItem onClick={() => router.push('/app/user/lists/Shared')}>Shared</MenuItem>
		</NavMenu>
	)
}

export default NavMenuLists

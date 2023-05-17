import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { DetailedHTMLProps, HTMLAttributes } from 'react'

const NavHeader = () => {
	const router = useRouter()

	const handleDropdownClick = () => {
		const elem = document.activeElement as HTMLLinkElement
		if (elem) {
			elem?.blur()
		}
	}

	return (
		<header className="navbar bg-base-100">
			<div className="navbar-start">
				<div className="dropdown transition-all ease-in-out">
					<label tabIndex={0} className="btn btn-ghost btn-circle transition-all ease-in-out">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
						</svg>
					</label>
					<ul
						tabIndex={0}
						className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 transition-all ease-in-out"
					>
						<li className="transition-all ease-in-out" onClick={handleDropdownClick}>
							<Link href="/">Home</Link>
						</li>
						{router.pathname.includes('app') && (
							<>
								<li className="transition-all ease-in-out" onClick={handleDropdownClick}>
									<Link href="/app/search-games">Search Games</Link>
								</li>
								<li className="transition-all ease-in-out" onClick={handleDropdownClick}>
									<Link href="/app/my-collection">My Collection</Link>
								</li>
								<li className="transition-all ease-in-out" onClick={handleDropdownClick}>
									<Link href="/app/my-wishlist">My Wishlist</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
			<div className="navbar-center">
				<Link href="/" className="btn btn-ghost normal-case text-xl">
					GoodGame.GG
				</Link>
			</div>
			<div className="navbar-end pr-3">
				<SignedIn>
					<UserButton signInUrl="/auth/sign-in" afterSignOutUrl="/" />
				</SignedIn>
				<SignedOut>
					<SignInButton />
				</SignedOut>
			</div>
		</header>
	)
}

export default NavHeader

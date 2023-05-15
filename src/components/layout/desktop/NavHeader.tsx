import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const NavHeader = () => {
	const router = useRouter()

	return (
		<div className="navbar bg-base-100">
			<div className="navbar-start">
				<div className="dropdown">
					<label tabIndex={0} className="btn btn-ghost btn-circle">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
						</svg>
					</label>
					<ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
						<li>
							<Link href="/">Home</Link>
						</li>
						{router.pathname.includes('app') && (
							<>
								<li>
									<Link href="/app/my-collection">My Collection</Link>
								</li>
								<li>
									<Link href="/app/search-games">Search Games</Link>
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
		</div>
	)
}

export default NavHeader

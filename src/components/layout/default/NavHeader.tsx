import React from 'react'
import { Navbar, Typography, Button, Collapse } from '@material-tailwind/react'
import styles from '../../../styles/components/NavHeader.module.css'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Turn as Hamburger } from 'hamburger-react'
import { useRouter } from 'next/router'
import NavList from './NavList'
import MobileNavDrawer from './MobileNavDrawer'

const NavHeader = () => {
	const router = useRouter()
	const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)

	const handleRouteChange = () => {
		setIsMenuOpen(false)
	}

	React.useEffect(() => {
		router.events.on('routeChangeStart', handleRouteChange)

		return () => {
			router.events.off('routeChangeStart', handleRouteChange)
		}
	}, [router])

	React.useEffect(() => {
		window.addEventListener('resize', () => window.innerWidth >= 960 && setIsMenuOpen(false))
	}, [])

	// TODO: update desktop nav items to match mobile
	return (
		<>
			<Navbar id={styles.navbar}>
				<div className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
					<div className="container mx-auto lg:grid lg:grid-cols-3 flex  justify-between items-center text-blue-gray-900">
						<div className="block lg:hidden">
							<Hamburger
								size={22}
								toggled={isMenuOpen}
								toggle={() => {
									setIsMenuOpen((prev: boolean) => !prev)
								}}
							/>
						</div>
						<div className="flex flex-col justify-self-center lg:justify-self-start">
							<Link href="/" className="mr-4 cursor-pointer py-1.5 font-medium">
								<Typography className="mr-4 cursor-pointer py-1.5 font-medium">GoodGame.GG</Typography>
							</Link>
						</div>
						<div className="hidden lg:block align-middle justify-self-center">
							<SignedIn>
								<NavList />
							</SignedIn>
						</div>
						<div className="flex flex-row gap-2 items-center justify-self-end">
							<div className="lg:block hidden mr-2">
								<SignedIn>
									<Button color="blue" variant="gradient" size="sm" className="hidden lg:inline-block">
										<Link href="/app/search/games">Find a Game</Link>
									</Button>
								</SignedIn>
							</div>
							<div>
								<SignedIn>
									<UserButton signInUrl="/sign-in" afterSignOutUrl="/" />
								</SignedIn>
								<SignedOut>
									<SignInButton />
								</SignedOut>
							</div>
						</div>
					</div>
				</div>
			</Navbar>
			<MobileNavDrawer open={isMenuOpen} closeDrawer={() => setIsMenuOpen(false)} />
		</>
	)
}

export default NavHeader

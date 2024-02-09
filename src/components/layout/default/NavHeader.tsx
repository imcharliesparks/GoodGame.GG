import React from 'react'
import { Navbar, Typography, Button, Collapse } from '@material-tailwind/react'
import styles from '../../../styles/components/NavHeader.module.css'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Turn as Hamburger } from 'hamburger-react'
import { useRouter } from 'next/router'
import NavList from './NavList'

const NavHeader = () => {
	const router = useRouter()
	const [navToggled, setNavToggled] = React.useState<boolean>(false)
	// const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)
	// const [searchTerm, setSearchTerm] = React.useState<string>('')
	// const [isSearchBarLoading, setIsSearchBarLoading] = React.useState<boolean>(false)
	const handleRouteChange = () => {
		setNavToggled(false)
	}

	React.useEffect(() => {
		router.events.on('routeChangeStart', handleRouteChange)

		return () => {
			router.events.off('routeChangeStart', handleRouteChange)
		}
	}, [router])

	React.useEffect(() => {
		window.addEventListener('resize', () => window.innerWidth >= 960 && setNavToggled(false))
	}, [])

	// const handleSearch = () => {
	// 	setIsSearchBarLoading(true)
	// 	router.push(`/app/search/games?search=${searchTerm}`)
	// 	setIsSearchBarLoading(false)
	// }

	return (
		<Navbar id={styles.navbar}>
			<div className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
				<div className="container mx-auto lg:grid lg:grid-cols-3 flex justify-between items-center text-blue-gray-900">
					<div className="flex flex-col">
						<Link href="/" className="mr-4 cursor-pointer py-1.5 font-medium">
							<Typography className="mr-4 cursor-pointer py-1.5 font-medium">GoodGame.GG</Typography>
						</Link>
					</div>
					<div className="hidden lg:block align-middle justify-self-center">
						<NavList />
					</div>
					<div className="flex flex-row gap-2 items-center justify-self-end">
						<div className="lg:block hidden mr-2">
							<Button color="blue" variant="gradient" size="sm" className="hidden lg:inline-block">
								<Link href="/app/search/games">Find a Game</Link>
							</Button>
						</div>
						{/* TODO: Revisit this */}
						{/* <div className="relative">
							<Input
								value={searchTerm}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
								label="Search Games"
								type="text"
								placeholder="Search..."
								className="w-[200px]"
							/>
							<Button
								type="submit"
								loading={isSearchBarLoading}
								size="sm"
								color={'blue-gray'}
								className="!absolute right-1 top-1 rounded"
								onClick={handleSearch}
							>
								Search
							</Button>
						</div> */}

						<div className="block lg:hidden">
							<Hamburger
								size={22}
								toggled={navToggled}
								toggle={() => {
									setNavToggled((prev: boolean) => !prev)
								}}
							/>
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
				<Collapse open={navToggled}>
					<div className="container mx-auto">
						<NavList />
					</div>
				</Collapse>
			</div>
		</Navbar>
	)
}

export default NavHeader

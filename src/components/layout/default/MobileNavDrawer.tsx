import { SignedIn, useUser } from '@clerk/nextjs'
import {
	Drawer,
	Typography,
	IconButton,
	Button,
	Chip,
	List,
	ListItem,
	ListItemPrefix,
	ListItemSuffix,
	Input
} from '@material-tailwind/react'
import { useRouter } from 'next/router'
import React from 'react'

type MobileNavDrawerProps = {
	open: boolean
	closeDrawer: () => void
}

const MobileNavDrawer = ({ open, closeDrawer }: MobileNavDrawerProps) => {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = React.useState<string>('')
	const { isSignedIn } = useUser()

	const handleSearch = () => {
		router.push(`/app/search/games?search=${searchTerm}`)
		setSearchTerm('')
	}

	return (
		<Drawer open={open} onClose={closeDrawer} className="p-4">
			<div className="mb-2 flex items-center justify-between p-4">
				<Typography variant="h5" color="blue-gray">
					GoodGame.GG
				</Typography>
				<IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="h-5 w-5"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</IconButton>
			</div>
			{isSignedIn ? (
				<List>
					<ListItem onClick={() => router.push('/app/user/lists/Collection')}>
						<ListItemPrefix>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
								/>
							</svg>
						</ListItemPrefix>
						My Collection
					</ListItem>
					<ListItem onClick={() => router.push('/app/user/lists')}>
						<ListItemPrefix>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
								/>
							</svg>
						</ListItemPrefix>
						My Lists
					</ListItem>
					{/* TODO: Reinstate on next update */}
					{/* <ListItem onClick={() => router.push('/app/games')}>
						<ListItemPrefix>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
								/>
							</svg>
						</ListItemPrefix>
						Games
					</ListItem> */}
					{/* TODO: Reinstate in next update */}
					{/* <ListItem onClick={() => router.push('/app/user/friends')}>
						<ListItemPrefix>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
								/>
							</svg>
						</ListItemPrefix>
						Friends
						<ListItemSuffix>
							<Chip value="5" size="sm" color="green" className="rounded-full" />
						</ListItemSuffix>
					</ListItem>
					<ListItem onClick={() => router.push('/app/user/self/profile')}>
						<ListItemPrefix>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
								<path
									fillRule="evenodd"
									d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
									clipRule="evenodd"
								/>
							</svg>
						</ListItemPrefix>
						My Profile
					</ListItem> */}
				</List>
			) : (
				<List>
					<ListItem onClick={() => router.push('/sign-up')}>
						<ListItemPrefix>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
								<path
									fillRule="evenodd"
									d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
									clipRule="evenodd"
								/>
							</svg>
						</ListItemPrefix>
						Sign Up
					</ListItem>
					<ListItem onClick={() => router.push('/sign-in')}>
						<ListItemPrefix>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
								<path
									fillRule="evenodd"
									d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
									clipRule="evenodd"
								/>
							</svg>
						</ListItemPrefix>
						Sign In
					</ListItem>
					{/* TODO: Reinstate this */}
					{/* <ListItem onClick={() => router.push('/app/user/lists')}>
						<ListItemPrefix>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
								/>
							</svg>
						</ListItemPrefix>
						Discover Games
					</ListItem> */}
				</List>
			)}
			<SignedIn>
				<div className="relative mt-4">
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
						size="sm"
						color={'blue-gray'}
						className="!absolute right-1 top-1 rounded"
						onClick={handleSearch}
					>
						Search
					</Button>
				</div>
			</SignedIn>
		</Drawer>
	)
}

export default MobileNavDrawer

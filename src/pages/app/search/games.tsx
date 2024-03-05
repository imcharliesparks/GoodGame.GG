import React from 'react'
import { APIMethods, APIStatuses, CollectionNames, GGLists, ListWithOwnership, MobyGame } from '@/shared/types'
import SearchGameCard from '@/components/general/SearchGameCard'
import { getAuth } from '@clerk/nextjs/server'
import { GetServerSidePropsContext } from 'next'
import firebase_app from '@/lib/firebase'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { SubstandardGenres } from '@/shared/constants'
import { convert } from 'html-to-text'
import { convertFirebaseTimestamps } from '@/shared/utils'
import { Button, Input } from '@material-tailwind/react'
import { useCurrentlySelectedGame, useListsWithOwnership, useUserListsState } from '@/components/hooks/useStateHooks'
import SearchPageBottomDrawer from '@/components/Drawers/BottomDrawer/SearchPageBottomDrawer'

type SearchGamePageProps = {
	searchQuery?: string
	// TODO: If this is made public factor that in here
	lists?: GGLists
	foundGames?: MobyGame[]
}

// TODO: Add initial loading when hydrating from SSR
const SearchGamesPage = ({ searchQuery, lists, foundGames }: SearchGamePageProps) => {
	const [searchTerm, setSearchTerm] = React.useState<string>('')
	const [searchError, setSearchError] = React.useState<string | null>(null)
	const [addSuccessText, setAddSuccessText] = React.useState<string | null>(null)
	const [games, setGames] = React.useState<MobyGame[]>()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const getListsWithOwnership = useListsWithOwnership()
	const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false)
	const [_userLists, setUserLists] = useUserListsState()
	const [_selectedGame, setSelectedGame] = useCurrentlySelectedGame()

	React.useEffect(() => {
		if (lists && Object.keys(lists).length) setUserLists(lists)
	}, [lists])

	const openDrawer = () => setIsDrawerOpen(true)
	const closeDrawer = () => setIsDrawerOpen(false)

	React.useEffect(() => {
		if (searchQuery) {
			// @ts-ignore
			setSearchTerm(searchQuery)
		}

		if (foundGames) {
			setGames(foundGames)
		}
	}, [])

	const handleShowErrorToast = (errorText: string) => {
		setSearchError(errorText)
		setTimeout(() => {
			setSearchError(null)
		}, 5000)
	}

	const handleShowSuccessToast = (successText: string) => {
		setAddSuccessText(successText)
		setTimeout(() => {
			setAddSuccessText(null)
		}, 5000)
	}

	const handleSearch = async () => {
		if (!searchTerm) {
			handleShowErrorToast('Enter a search term!')
		} else {
			setIsLoading(true)

			const queryParams = new URLSearchParams(window.location.search)
			queryParams.set('search', searchTerm)
			const newRelativePathQuery = window.location.pathname + '?' + queryParams.toString()
			window.history.pushState(null, '', newRelativePathQuery)

			try {
				// TODO: Add filtering for genre and platform
				const payload = { title: searchTerm }
				const request = await fetch(`/api/games/search`, {
					method: APIMethods.POST,
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(payload)
				})
				const response = await request.json()
				if (response.status === APIStatuses.ERROR) {
					throw new Error(response.data.error)
				} else {
					setGames(response.data.games)
				}
			} catch (error) {
				console.error(`Could not find a game with the name ${searchTerm}`, error)
				handleShowErrorToast(`We couldn't find a game by that name!`)
			} finally {
				setIsLoading(false)
			}
		}
	}

	const handleOpenDrawer = (game: MobyGame) => {
		setSelectedGame(game)
		getListsWithOwnership(game.game_id)
		openDrawer()
	}

	return (
		<div className="max-w-screen flex flex-col items-center py-6">
			<div className="container">
				<form
					className="mx-auto w-full flex flex-col md:flex-row justify-center items-center relative"
					onSubmit={(e) => {
						e.preventDefault()
						handleSearch()
					}}
				>
					<div className="relative w-full md:max-w-[425px]">
						<Input
							value={searchTerm}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
							label="Search for a Game"
							type="text"
							placeholder="Search for a game..."
							className=""
						/>
						<Button
							type="submit"
							loading={isLoading}
							size="sm"
							color={'blue-gray'}
							className="!absolute right-1 top-1 rounded"
						>
							Search
						</Button>
					</div>
				</form>
				<div className="container w-full flex flex-col mt-4">
					{games?.map((game, i: number) => (
						<SearchGameCard
							lastCard={i === games.length - 1}
							key={game.game_id}
							game={game}
							handleOpenDrawer={() => handleOpenDrawer(game)}
						/>
					))}
				</div>
			</div>
			{searchError && (
				<div className="toast toast-center min-w-max z-50">
					<div className="alert alert-error">
						<div>
							<span>{searchError}</span>
						</div>
					</div>
				</div>
			)}
			{addSuccessText && (
				<div className="toast toast-center min-w-max z-50">
					<div className="alert alert-success">
						<div>
							<span>{addSuccessText}</span>
						</div>
					</div>
				</div>
			)}
			{isDrawerOpen && (
				<SearchPageBottomDrawer
					open={isDrawerOpen}
					close={closeDrawer}
					// lists={listsWithOwnership}
					// setListsWithOwnership={setListsWithOwnership}
				/>
			)}
		</div>
	)
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { userId } = getAuth(ctx.req)
	const searchTerm = ctx.query.search
	const props: SearchGamePageProps = {}

	try {
		const db = getFirestore(firebase_app)
		const userCollectionRef = collection(db, CollectionNames.USERS)
		const q = query(userCollectionRef, where('clerkId', '==', userId))
		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			console.error('Non logged in user accessing search')
		} else {
			const { lists } = Object.assign(querySnapshot.docs[0].data(), {})

			for (const listName in lists) {
				convertFirebaseTimestamps(lists[listName])
			}
			if (lists && Object.keys(lists).length) {
				props.lists = lists
			}
		}

		if (searchTerm) {
			props.searchQuery = searchTerm as string
			let reqUrl = `https://api.mobygames.com/v1/games?format=normal&api_key=${process.env.MOBY_GAMES_API_KEY}&title=${searchTerm}`

			// TODO: Add support for search parameters
			// if (searchParameters.genre) {
			// 	reqUrl += `&genre=${searchParameters.genre}`
			// }

			// if (searchParameters.platform) {
			// 	reqUrl += `&platform=${searchParameters.platform}`
			// }

			const request = await fetch(reqUrl)
			const response = await request.json()
			if (response.games && response.games.length) {
				const filteredGamesList = response.games.filter(
					(game: MobyGame) => !SubstandardGenres.has(game.genres[0].genre_name)
				)
				const finalGamesList = filteredGamesList.map((game: MobyGame) => ({
					...game,
					description: convert(
						game.description,
						{ selectors: [{ selector: 'a', options: { ignoreHref: true } }] },
						{ selector: 'img', options: { ignoreHref: true } }
					)
				}))
				props.foundGames = finalGamesList
			}
		}
	} catch (error) {
		console.error('there was an error fetching initial data on the search/games page', error)
	} finally {
		return {
			props
		}
	}
}

export default SearchGamesPage

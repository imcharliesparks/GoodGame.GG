import React from 'react'
import { APIMethods, APIStatuses, CollectionNames, GGLists, ListWithOwnership, MobyGame } from '@/shared/types'
import LoadingSpinner from '@/components/general/LoadingSpinner'
import NewSearchGameCard from '@/components/general/NewSearchGameCard'
import { getAuth } from '@clerk/nextjs/server'
import { GetServerSidePropsContext } from 'next'
import firebase_app from '@/lib/firebase'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { useUserHasGameInCollection } from '@/components/hooks/useUserHasGameInCollection'
import { SubstandardGenres } from '@/shared/constants'
import { convert } from 'html-to-text'
import { convertFirebaseTimestamps } from '@/shared/utils'
import { useRouter } from 'next/router'
import GameDetailsBottomDrawer from '@/components/Drawers/BottomDrawer/GameDetailsBottomDrawer'

type SearchGamePageProps = {
	searchQuery?: string
	// TODO: If this is made public factor that in here
	lists?: GGLists
	userIsAuthd: boolean
	foundGames?: MobyGame[]
}

// TODO: Disallow adding of games once the user already has them
// TODO: Add pagination to search for speed
// TODO: Need to better handle removal from lists
const SearchGamesPage = ({ searchQuery, lists, userIsAuthd, foundGames }: SearchGamePageProps) => {
	const router = useRouter()
	const inputRef = React.useRef<HTMLInputElement | null>(null)
	const [searchError, setSearchError] = React.useState<string | null>(null)
	const [addSuccessText, setAddSuccessText] = React.useState<string | null>(null)
	const [games, setGames] = React.useState<MobyGame[]>()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)
	const [listsWithOwnership, setListsWithOwnership] = React.useState<ListWithOwnership[]>([])
	const [selectedGame, setSelectedGame] = React.useState<MobyGame>()
	const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false)

	const openDrawer = () => setIsDrawerOpen(true)
	const closeDrawer = () => setIsDrawerOpen(false)

	React.useEffect(() => {
		if (searchQuery) {
			// @ts-ignore
			inputRef.current.value = searchQuery
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
		const searchTerm = inputRef.current?.value

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
		const foundListsWithOwnership = useUserHasGameInCollection(game.game_id, lists!)
		setListsWithOwnership(foundListsWithOwnership)
		setSelectedGame(game)
		openDrawer()
	}

	return (
		<div className="max-w-screen flex flex-col items-center py-6">
			<div className="container">
				<form
					className="mx-auto w-full flex flex-col md:flex-row justify-center items-center"
					onSubmit={(e) => {
						e.preventDefault()
						handleSearch()
					}}
				>
					<input
						ref={inputRef}
						type="text"
						placeholder="Search for a game..."
						className="input input-primary w-full max-w-xs text-black"
					/>
					<button type="submit" className="btn  btn-primary ml-0 mt-3 md:ml-2 md:mt-0">
						{isLoading ? <LoadingSpinner /> : 'Search'}
					</button>
				</form>
				<div className="container w-full flex flex-col mt-4">
					{games?.map((game, i: number) => (
						<NewSearchGameCard
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
			{selectedGame && (
				<GameDetailsBottomDrawer
					game={selectedGame!}
					open={isDrawerOpen}
					close={closeDrawer}
					lists={listsWithOwnership}
					setListsWithOwnership={setListsWithOwnership}
				/>
			)}
		</div>
	)
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { userId } = getAuth(ctx.req)
	const searchTerm = ctx.query.search
	const props: SearchGamePageProps = {
		userIsAuthd: userId ? true : false
	}

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

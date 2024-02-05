import React from 'react'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	GGLists,
	GamePlayStatus,
	ListWithOwnership,
	MobyGame,
	Platform,
	StoredGame
} from '@/shared/types'
import LoadingSpinner from '@/components/general/LoadingSpinner'
import NewSearchGameCard from '@/components/general/NewSearchGameCard'
import AddToListModal from '@/components/modal/AddToListModal/AddToListModal'
import { getAuth } from '@clerk/nextjs/server'
import { GetServerSidePropsContext } from 'next'
import firebase_app from '@/lib/firebase'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { useUserHasGameInCollection } from '@/components/hooks/useUserHasGameInCollection'
import { SubstandardGenres } from '@/shared/constants'
import { convert } from 'html-to-text'
import { convertFirebaseTimestamps } from '@/shared/utils'
import { useRouter } from 'next/router'

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

	React.useEffect(() => {
		console.log('listsWithOwnership', listsWithOwnership)
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

	const handleAddGameToList = async (
		listName: string,
		index: number,
		gameplayStatus: GamePlayStatus,
		platforms: Platform[]
	): Promise<boolean> => {
		let success: boolean = false
		const gameFromLocalStorage = localStorage.getItem('currentlySelectedGame')
		let currentlySelectedGame: MobyGame

		try {
			if (!gameFromLocalStorage) throw new Error('No game found in local storage on search page')
			currentlySelectedGame = JSON.parse(gameFromLocalStorage)
			const { game_id, moby_score, sample_cover, title, description } = currentlySelectedGame!
			const payload: Omit<StoredGame, 'dateAdded'> = {
				game_id,
				moby_score,
				sample_cover,
				title,
				platform: platforms.reduce(
					(prev: string, platform: Platform, i: number) =>
						i === 0 ? `${platform.platform_name}` : `${prev}, ${platform.platform_name}`,
					''
				),
				playStatus: gameplayStatus ?? GamePlayStatus.NOT_PLAYED,
				description: description ?? 'No Description Found'
			}

			const request = await fetch(`/api/lists/${listName}/update`, {
				method: APIMethods.PATCH,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				handleUpdateListWithOwnership(index, true)
				success = true
				handleShowSuccessToast(`Success! We've added ${currentlySelectedGame!.title} to your ${listName} list.`)
				router.replace(router.asPath)
			}
		} catch (error) {
			console.error(`Unable to add game to list`, error)
			handleShowErrorToast(
				`We couldn't add ${
					// @ts-ignore
					currentlySelectedGame ? currentlySelectedGame.title : 'NO TITLE'
				} to your ${listName} list. Please try again in a bit.`
			)
		} finally {
			return success
		}
	}

	const handleDeleteGameFromList = async (listName: string, index: number): Promise<boolean> => {
		let success: boolean = false
		const gameFromLocalStorage = localStorage.getItem('currentlySelectedGame')
		let currentlySelectedGame: MobyGame

		try {
			if (!gameFromLocalStorage) throw new Error('No game found in local storage on search page')
			currentlySelectedGame = JSON.parse(gameFromLocalStorage)
			const { game_id } = currentlySelectedGame!

			const request = await fetch(`/api/lists/${listName}/${game_id}/remove`, {
				method: APIMethods.DELETE,
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				handleUpdateListWithOwnership(index, false)
				success = true
				handleShowSuccessToast(`We've Deleted ${currentlySelectedGame!.title} to your ${listName} list.`)
				router.replace(router.asPath)
			}
		} catch (error) {
			console.error(`Unable to remove game from list`, error)
			handleShowErrorToast(
				`We couldn't remove ${
					// @ts-ignore
					currentlySelectedGame ? currentlySelectedGame.title : 'NO TITLE'
				} from your ${listName} list. Please try again in a bit.`
			)
		} finally {
			return success
		}
	}

	const handleOpenListsModal = (game: MobyGame) => {
		const { game_id } = game
		localStorage.setItem('currentlySelectedGame', JSON.stringify(game))
		setIsModalOpen(true)
		const foundListsWithOwnership = useUserHasGameInCollection(game_id, lists!)
		setListsWithOwnership(foundListsWithOwnership)
	}

	const handleUpdateListWithOwnership = (index: number, ownershipStatus: boolean) => {
		setListsWithOwnership((prev: ListWithOwnership[]) => {
			const updated = Array.from(prev)
			updated[index].hasGame = ownershipStatus
			return updated
		})
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
							handleOpenModal={() => {
								handleOpenListsModal(game)
							}}
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

			{userIsAuthd && (
				<AddToListModal
					lists={listsWithOwnership!}
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					handleAddGameToList={handleAddGameToList}
					handleDeleteGameFromList={handleDeleteGameFromList}
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

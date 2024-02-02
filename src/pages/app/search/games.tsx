import React from 'react'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	GGGame,
	GGLists,
	GamePlayStatus,
	ListWithOwnership,
	MobyGame,
	StoredGame
} from '@/shared/types'
import SearchGameCard from '@/components/general/SearchGameCard'
import LoadingSpinner from '@/components/general/LoadingSpinner'
import NewSearchGameCard from '@/components/general/NewSearchGameCard'
import BaseModal from '@/components/modal/BaseModal'
import AddToListModalContents from '@/components/modal/AddToListModalContents'
import AddToListModal from '@/components/modal/AddToListModal'
import { getAuth } from '@clerk/nextjs/server'
import { GetServerSidePropsContext } from 'next'
import { clerkClient } from '@clerk/nextjs'
import firebase_app from '@/lib/firebase'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { useUserHasGameInCollection } from '@/components/hooks/useUserHasGameInCollection'

type SearchGamePageProps = {
	searchQuery?: string
	// TODO: If this is made public factor that in here
	lists?: GGLists
	userIsAuthd: boolean
}

// fuckin figure this out at some point. Or don't I don't care if it works
let currentlySelectedGame: MobyGame

// TODO: Disallow adding of games once the user already has them
// TODO: Add pagination to search for speed
// TODO: Grab user data here to determine if they have the game or not
const SearchGamesPage = ({ searchQuery, lists, userIsAuthd }: SearchGamePageProps) => {
	const inputRef = React.useRef<HTMLInputElement | null>(null)
	const [searchError, setSearchError] = React.useState<string | null>(null)
	const [addSuccessText, setAddSuccessText] = React.useState<string | null>(null)
	const [games, setGames] = React.useState<MobyGame[]>()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)
	const [listsWithOwnership, setListsWithOwnership] = React.useState<ListWithOwnership[]>([])

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
		if (!inputRef.current?.value) {
			handleShowErrorToast('Enter a search term!')
		} else {
			setIsLoading(true)
			try {
				// TODO: Add filtering for genre and platform
				const payload = {
					title: inputRef?.current.value
				}
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
				console.error(`Could not find a game with the name ${inputRef.current.value}`, error)
				handleShowErrorToast(`We couldn't find a game by that name!`)
			} finally {
				setIsLoading(false)
			}
		}
	}

	const handleAddGameToList = async (list: string) => {
		if (currentlySelectedGame) {
			try {
				const { game_id, moby_score, sample_cover, title } = currentlySelectedGame!
				const payload: Omit<StoredGame, 'dateAdded'> = {
					game_id,
					moby_score,
					sample_cover,
					title,
					platform: 'N/A', // TODO: FIX THIS
					playStatus: GamePlayStatus.NOT_PLAYED
				}

				console.log('payload', payload)

				const request = await fetch(`/api/lists/${list}/add`, {
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
					// router.replace(router.asPath)
					handleShowSuccessToast(`Success! We've added ${currentlySelectedGame!.title} to your ${list} list.`)
				}
			} catch (error) {
				console.error(`Unable to add game to list`, error)
				handleShowErrorToast(
					`We couldn't add ${currentlySelectedGame!.title} to your ${list} list. Please try again in a bit.`
				)
			}
		}
	}

	const handleOpenListsModal = (game: MobyGame) => {
		const { game_id } = game
		currentlySelectedGame = game
		setIsModalOpen(true)
		const foundListsWithOwnership = useUserHasGameInCollection(game_id, lists!)
		setListsWithOwnership(foundListsWithOwnership)
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
							handleShowSuccessToast={handleShowSuccessToast}
							handleShowErrorToast={handleShowErrorToast}
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
				/>
			)}
		</div>
	)
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { userId } = getAuth(ctx.req)
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

			if (lists && Object.keys(lists).length) {
				props.lists = lists
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

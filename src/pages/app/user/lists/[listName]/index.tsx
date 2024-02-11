import RemoveFromListDialog from '@/components/Dialogs/RemoveFromListDialog'
import NewGameCard from '@/components/Games/NewGameCard'
import firebase_app from '@/lib/firebase'
import { APIMethods, APIStatuses, CollectionNames, StoredGame } from '@/shared/types'
import { convertFirebaseTimestamps } from '@/shared/utils'
import { getAuth } from '@clerk/nextjs/server'
import { Typography } from '@material-tailwind/react'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import router, { useRouter } from 'next/router'
import React from 'react'

type IndividualListPageProps = {
	games: StoredGame[]
	listName: string
	error?: string
}

// TODO Add toasts for errors here
// TODO: Add sorting
const IndividualListPage = ({ games, listName, error }: IndividualListPageProps) => {
	const router = useRouter()
	const [currentlySelectedGame, setCurrentlySelectedGame] = React.useState<StoredGame>()
	const [showRemoveFromListDialog, setShowRemoveFromListDialog] = React.useState<boolean>(false)
	const [isLoading, setIsLoading] = React.useState<boolean>(false)

	const toggleRemoveFromListDialog = (isOpen?: boolean) =>
		setShowRemoveFromListDialog(isOpen ?? !showRemoveFromListDialog)

	const removeFromList = async (game_id: number, currentListName: string) => {
		setIsLoading(true)
		try {
			const request = await fetch(`/api/lists/${currentListName}/${game_id}/remove`, {
				method: APIMethods.DELETE,
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				// TODO: Update with alert from material
				alert(`Success! We removed the game.`)
				toggleRemoveFromListDialog()
				// CS NOTE: This is the pattern for refreshing GSSP data 😬
				router.replace(router.asPath)
			}
		} catch (error) {
			console.error(`Could not delete game with gameId ${game_id}`, error)
			// TODO: Update with alert from material
			alert(`We couldn't remove that game! Please try again.`)
			// setError(`We couldn't remove that game! Please try again.`)
			// setTimeout(() => {
			// 	setError('')
			// }, 6000)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<section className="w-full">
			<Typography variant="h4" className="mx-auto text-center my-4">
				{listName}
			</Typography>
			<div className="flex flex-col mx-auto lg:hidden gap-4 max-w-[208px]">
				{games.map(
					(game: StoredGame) =>
						typeof game !== 'string' && (
							<NewGameCard
								key={game.game_id}
								game={game}
								listName={listName}
								toggleRemoveFromListDialog={toggleRemoveFromListDialog}
								setCurrentlySelectedGame={setCurrentlySelectedGame}
							/>
						)
				)}
			</div>
			{currentlySelectedGame && (
				<RemoveFromListDialog
					isOpen={showRemoveFromListDialog}
					gameName={currentlySelectedGame.title}
					listName={listName}
					isDeleteButtonLoading={isLoading}
					handler={toggleRemoveFromListDialog}
					handleRemoveFromList={() => removeFromList(currentlySelectedGame.game_id, listName)}
				/>
			)}
		</section>
	)
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { query: urlParameter } = ctx
	const { userId } = getAuth(ctx.req)
	const listName = urlParameter.listName as string
	const props: IndividualListPageProps = {
		games: [],
		listName: ''
	}

	if (!listName) {
		return {
			props: {
				...props,
				error: 'No list provided to query!'
			}
		}
	} else if (!userId) {
		return {
			props: {
				...props,
				error: 'User is not authd!'
			}
		}
	}

	props.listName = listName

	try {
		const db = getFirestore(firebase_app)
		const userCollectionRef = collection(db, CollectionNames.USERS)
		const q = query(userCollectionRef, where('clerkId', '==', userId))
		const querySnapshot = await getDocs(q)
		if (querySnapshot.empty) {
			console.error('Non logged in user accessing search')
		} else {
			const { lists } = Object.assign(querySnapshot.docs[0].data(), {})

			if (lists[listName]) {
				convertFirebaseTimestamps(lists[listName])
				const foundGames: StoredGame[] = []

				for (let game_id in lists[listName]) {
					foundGames.push(lists[listName][game_id])
				}

				props.games = foundGames
			} else {
				props.error = `The user does not have a list called ${listName}`
			}
		}
	} catch (error) {
		console.error('there was an error fetching initial data on the search/games page', error)
		props.error = 'There was an error fetching the games!'
	} finally {
		return {
			props: {
				...props
			}
		}
	}
}

export default IndividualListPage

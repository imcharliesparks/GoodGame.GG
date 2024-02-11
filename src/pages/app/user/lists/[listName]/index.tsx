import NewGameCard from '@/components/Games/NewGameCard'
import firebase_app from '@/lib/firebase'
import { CollectionNames, StoredGame } from '@/shared/types'
import { convertFirebaseTimestamps } from '@/shared/utils'
import { getAuth } from '@clerk/nextjs/server'
import { Typography } from '@material-tailwind/react'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import React from 'react'

type IndividualListPageProps = {
	games: StoredGame[]
	listName: string
	error?: string
}

// TODO Add toasts for errors here
const IndividualListPage = ({ games, listName, error }: IndividualListPageProps) => {
	const [currentlySelectedGame, setCurrentlySelectedGame] = React.useState<StoredGame>()
	const toggleRemoveFromListDialog = () => console.log('implement me')

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
								game={game}
								listName={listName}
								toggleRemoveFromListDialog={toggleRemoveFromListDialog}
								setCurrentlySelectedGame={setCurrentlySelectedGame}
							/>
						)
				)}
			</div>
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

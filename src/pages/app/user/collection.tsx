import CollectionGameCard from '@/components/general/CollectionGameCard'
import firebase_app from '@/lib/firebase'
import { CollectionNames, GGGame } from '@/shared/types'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import React from 'react'

type Props = {
	gamesCollection: GGGame[]
	dataFetchingError: string
}

// TODO: Intercept fetching with loading screen
// TODO: Copy game collection on load into local state and make removal work instantly without a refetch
const MyCollectionPage = ({ gamesCollection, dataFetchingError }: Props) => {
	const [error, setError] = React.useState<string>(dataFetchingError.length ? dataFetchingError : '')

	return (
		<div className="max-w-screen flex flex-col items-center py-6">
			<div className="container text-center">
				<h1 className="font-bold text-3xl mb-2">My Collection</h1>
				<div className="container w-full flex flex-col">
					{gamesCollection?.length ? (
						gamesCollection?.map((game) => <CollectionGameCard key={game.gameId} game={game} setError={setError} />)
					) : (
						<h1>You haven't added any games yet!</h1>
					)}
				</div>
			</div>
			{error && (
				<div className="toast toast-center min-w-max z-50">
					<div className="alert alert-error">
						<div>
							<span>{error}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { userId } = getAuth(ctx.req)
	const props: Props = {
		dataFetchingError: '',
		gamesCollection: []
	}
	try {
		const db = getFirestore(firebase_app)
		const collectionsCollectionRef = collection(db, CollectionNames.COLLECTIONS)
		const q = query(collectionsCollectionRef, where('ownerId', '==', userId))
		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			console.error(`No games found for collection. UserID: ${userId}`)
		} else {
			const foundUserCollection = Object.assign(querySnapshot.docs[0].data(), {})
			const formattedOwnedGames = []

			for (let gameId in foundUserCollection.ownedGames) {
				formattedOwnedGames.push(foundUserCollection.ownedGames[gameId])
			}

			props.gamesCollection = formattedOwnedGames
		}
	} catch (error) {
		console.error('e', error)
		props.dataFetchingError = 'There was an error fetching your collection! Please try again.'
	} finally {
		return {
			props
		}
	}
}

export default MyCollectionPage

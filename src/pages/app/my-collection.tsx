import CollectionGameCard from '@/components/general/CollectionGameCard'
import Loading from '@/components/general/Loading'
import { firebaseDB } from '@/lib/firebase'
import { APIMethods, APIStatuses, CollectionNames, GGGame } from '@/shared/types'
import { useAuth } from '@clerk/nextjs'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {
	gamesCollection: GGGame[]
	dataFetchingError: string
}

// TODO: Intercept fetching with loading screen
const MyCollectionPage = ({ gamesCollection, dataFetchingError }: Props) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [error, setError] = React.useState<string>(dataFetchingError.length ? dataFetchingError : '')

	const refreshData = () => {
		router.replace(router.asPath)
	}

	const removeFromCollection = async (slug: string) => {
		setIsLoading(true)
		try {
			const request = await fetch(`/api/collection/${slug}/remove`, {
				method: APIMethods.DELETE,
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				// CS NOTE: This is the pattern for refreshing GSSP data 😬
				refreshData()
			}
		} catch (error) {
			console.error(`Could not delete game with slug ${slug}`, error)
			setError(`We couldn't remove that game! Please try again.`)
			setTimeout(() => {
				setError('')
			}, 6000)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="max-w-screen flex flex-col items-center py-6">
			<div className="container text-center">
				<h1 className="font-bold text-3xl mb-2">My Collection</h1>
				<div className="container w-full flex flex-col">
					{gamesCollection?.length ? (
						gamesCollection?.map((game) => (
							<CollectionGameCard
								key={game.gameId}
								game={game}
								removeFromCollection={removeFromCollection}
								isButtonLoading={isLoading}
							/>
						))
					) : (
						<h1>You haven't added any games yet!</h1>
					)}
				</div>
			</div>
			{error && (
				<div className="toast toast-center min-w-max">
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
		const db = getFirestore(firebaseDB)
		const collectionsCollectionRef = collection(db, CollectionNames.COLLECTIONS)
		const q = query(collectionsCollectionRef, where('ownerId', '==', userId))
		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			console.error(`No games found for collection. UserID: ${userId}`)
		}

		const foundUserCollection = Object.assign(querySnapshot.docs[0].data(), {})
		const formattedOwnedGames = []

		for (let slug in foundUserCollection.ownedGames) {
			formattedOwnedGames.push(foundUserCollection.ownedGames[slug])
		}

		props.gamesCollection = formattedOwnedGames
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

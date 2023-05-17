import WishlistGameCard from '@/components/general/WishlistGameCard'
import { firebaseDB } from '@/lib/firebase'
import { APIMethods, APIStatuses, CollectionNames, GGGame, GamesWishlist } from '@/shared/types'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {
	gamesWishlist: GGGame[]
	dataFetchingError: string
}

// TODO: Intercept fetching with loading screen
const MyWishlistPage = ({ gamesWishlist, dataFetchingError }: Props) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [error, setError] = React.useState<string>(dataFetchingError.length ? dataFetchingError : '')

	const refreshData = () => {
		router.replace(router.asPath)
	}

	const removeFromCollection = async (gameId: number) => {
		setIsLoading(true)
		try {
			const request = await fetch(`/api/wishlist/${gameId}/remove`, {
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
			console.error(`Could not delete game with gameId ${gameId}`, error)
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
				<h1 className="font-bold text-3xl mb-2">My Wishlist</h1>
				<div className="container w-full flex flex-col">
					{gamesWishlist?.length ? (
						gamesWishlist?.map((game) => (
							<WishlistGameCard
								key={game.gameId}
								game={game}
								removeFromCollection={removeFromCollection}
								isButtonLoading={isLoading}
							/>
						))
					) : (
						<h1>You haven't added any games to your wishlist yet!</h1>
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
		gamesWishlist: []
	}
	try {
		const db = getFirestore(firebaseDB)
		const wishlistsCollectionRef = collection(db, CollectionNames.WISH_LISTS)
		const q = query(wishlistsCollectionRef, where('ownerId', '==', userId))
		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			console.error(`No games found for wishlist. UserID: ${userId}`)
		} else {
			const foundUserWishlist = Object.assign(querySnapshot.docs[0].data(), {}) as GamesWishlist
			const formattedWantedGames = []

			for (let gameId in foundUserWishlist.wantedGames) {
				formattedWantedGames.push(foundUserWishlist.wantedGames[gameId])
			}

			props.gamesWishlist = formattedWantedGames
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

export default MyWishlistPage

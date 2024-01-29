import WishlistGameCard from '@/components/general/WishlistGameCard'
import firebase_app from '@/lib/firebase'
import { CollectionNames, GGGame, GamesWishlist } from '@/shared/types'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import React from 'react'

type Props = {
	gamesWishlist: GGGame[]
	dataFetchingError: string
}

// TODO: Intercept fetching with loading screen
const MyWishlistPage = ({ gamesWishlist, dataFetchingError }: Props) => {
	const [error, setError] = React.useState<string>(dataFetchingError.length ? dataFetchingError : '')

	return (
		<div className="max-w-screen flex flex-col items-center py-6">
			<div className="container text-center">
				<h1 className="font-bold text-3xl mb-2">My Wishlist</h1>
				<div className="container w-full flex flex-col">
					{gamesWishlist?.length ? (
						gamesWishlist?.map((game) => <WishlistGameCard key={game.gameId} game={game} setError={setError} />)
					) : (
						<h1>You haven't added any games to your wishlist yet!</h1>
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
		gamesWishlist: []
	}
	try {
		const db = getFirestore(firebase_app)
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

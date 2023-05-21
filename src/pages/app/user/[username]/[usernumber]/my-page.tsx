import React from 'react'
import { firebaseDB } from '@/lib/firebase'
import { CollectionNames, GGGame, IGDBGame } from '@/shared/types'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import UserPageGameCard from '@/components/general/UserPageGameCard'
import styles from '../../../../../styles/pages/UserPage.module.css'
import { useRouter } from 'next/router'

type Props = {
	collection: GGGame[]
	wishlist: GGGame[]
	favorites: GGGame[]
	dataFetchingError: string
}

// TODO: Make heart dynamic by adding endpoint for favorites
// TODO: Make overflow-x property not cut shit off and be a greater width
// TODO: Make overflow-x more responsive on desktop (it's kind of hard to scroll right now)
const UserPage = ({ collection, wishlist, favorites, dataFetchingError }: Props) => {
	const router = useRouter()
	const [error, setError] = React.useState<string>(dataFetchingError.length ? dataFetchingError : '')
	const username = router.query.username as string
	const usernumber = router.query.usernumber as string
	const fullUsername = `${username}#${usernumber}`

	return (
		<div className="max-w-screen flex flex-col items-center py-6">
			<div className="max-w-[400px] mx-auto text-center">
				<h1 className="text-3xl">{username}'s Games</h1>
				<h2 className="text-slate-500">{fullUsername}</h2>
			</div>
			<hr className="h-px my-8 border-0 bg-slate-400 w-[80%]" />
			<div className="container text-center mb-8">
				<h1 className="font-bold text-3xl mb-2">My Favorites</h1>
				<div
					className={`container w-[90%] bg-none mx-auto flex flex-row overflow-y-scroll gap-3 rounded-2xl p-3 ${styles.horizontalScroll}`}
				>
					{collection.length ? (
						collection.map((game: GGGame) => (
							<UserPageGameCard key={`favorites_${game.gameId}`} game={game} setError={setError} />
						))
					) : (
						<h1 className="text-center mx-auto">You haven't added any games yet!</h1>
					)}
				</div>
			</div>
			<div className="container text-center mb-8">
				<h1 className="font-bold text-3xl mb-2">My Collection</h1>
				<div
					className={`container w-[90%] bg-none mx-auto flex flex-row overflow-y-scroll gap-3 rounded-2xl p-3 ${styles.horizontalScroll}`}
				>
					{collection.length ? (
						collection.map((game: GGGame) => (
							<UserPageGameCard key={`collection_${game.gameId}`} game={game} setError={setError} />
						))
					) : (
						<h1 className="text-center mx-auto">You haven't added any games yet!</h1>
					)}
				</div>
			</div>
			<div className="container text-center">
				<h1 className="font-bold text-3xl mb-2">My Wishlist</h1>
				<div
					className={`container w-[90%] bg-none mx-auto flex flex-row overflow-y-scroll gap-3 rounded-2xl p-3 ${styles.horizontalScroll}`}
				>
					{wishlist.length ? (
						wishlist.map((game: GGGame) => (
							<UserPageGameCard key={`wishlist_${game.gameId}`} game={game} setError={setError} />
						))
					) : (
						<h1 className="text-center mx-auto">You haven't added any games yet!</h1>
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

export default UserPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { userId } = getAuth(ctx.req)

	const props: Props = {
		dataFetchingError: '',
		collection: [],
		wishlist: [],
		favorites: []
	}

	try {
		const db = getFirestore(firebaseDB)
		const collectionsCollectionRef = collection(db, CollectionNames.COLLECTIONS)
		const collectionsQ = query(collectionsCollectionRef, where('ownerId', '==', userId))
		const collectionsQuerySnapshot = await getDocs(collectionsQ)
		let foundUserCollection

		if (collectionsQuerySnapshot.empty) {
			console.error(`No games found for collection. UserID: ${userId}`)
		} else {
			foundUserCollection = Object.assign(collectionsQuerySnapshot.docs[0].data(), {})
			const formattedOwnedGames: GGGame[] = []

			for (let gameId in foundUserCollection.ownedGames) {
				formattedOwnedGames.push(foundUserCollection.ownedGames[gameId])
			}

			props.collection = formattedOwnedGames
		}

		const wishlistsCollectionRef = collection(db, CollectionNames.WISH_LISTS)
		const wishlistQ = query(wishlistsCollectionRef, where('ownerId', '==', userId))
		const wishlistQuerySnapshot = await getDocs(wishlistQ)
		let foundUserWishlist

		if (wishlistQuerySnapshot.empty) {
			console.error(`No games found for wishlist. UserID: ${userId}`)
		} else {
			foundUserWishlist = Object.assign(wishlistQuerySnapshot.docs[0].data(), {})
			const formattedWishlistGames = []

			for (let gameId in foundUserWishlist.wantedGames) {
				formattedWishlistGames.push(foundUserWishlist.wantedGames[gameId])
			}

			props.wishlist = formattedWishlistGames
		}

		const favoritesCollectionRef = collection(db, CollectionNames.FAVORITES)
		const favoritesQ = query(favoritesCollectionRef, where('ownerId', '==', userId))
		const favoritesQuerySnapshot = await getDocs(favoritesQ)
		let foundFavoriteGames

		if (favoritesQuerySnapshot.empty) {
			console.error(`No games found for wishlist. UserID: ${userId}`)
		} else {
			foundFavoriteGames = Object.assign(favoritesQuerySnapshot.docs[0].data(), {})
			const formattedFavoriteGames = []

			for (let gameId in foundFavoriteGames.favoriteGames) {
				formattedFavoriteGames.push(foundFavoriteGames.favoriteGames[gameId])
			}

			props.favorites = formattedFavoriteGames
		}
		console.log('props.favorites', props.favorites)
	} catch (error) {
		console.error('e', error)
		props.dataFetchingError = 'There was an error fetching your games! Please try again.'
	} finally {
		return {
			props
		}
	}
}

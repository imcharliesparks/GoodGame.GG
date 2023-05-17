import { firebaseDB } from '@/lib/firebase'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GameCollection,
	GamesWishlist,
	GeneralAPIResponses
} from '@/shared/types'
import { withAuth } from '@clerk/nextjs/dist/api'
import { collection, getDocs, getFirestore, query, where, updateDoc, doc } from 'firebase/firestore'

// TODO: Figure out a way to make the page reload smoother (maybe route to the previous element by ID in the URL or something?)
const handler = withAuth(async (req, res) => {
	const { auth, method } = req
	const { userId } = auth
	const gameId = Number(req.query.gameId as string)

	if (!userId) {
		console.error('User not authorized.')
		return res.status(401).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'User not authorized.' }
		})
	}

	if (!gameId) {
		console.error('No game ID provided to remove from wishlist endpoint.')
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'Game ID not provided to remove from wishlist endpoint' }
		})
	}

	if (method === APIMethods.DELETE) {
		try {
			const db = getFirestore(firebaseDB)
			const wishlistCollectionRef = collection(db, CollectionNames.WISH_LISTS)
			const q = query(wishlistCollectionRef, where('ownerId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				console.error('Wishlist was empty when trying to remove a game.')
				return res.status(404).json({
					status: APIStatuses.ERROR,
					type: GeneralAPIResponses.FAILURE,
					data: { error: 'Collection not found when trying to delete.' }
				})
			}

			const updatedWishlist = Object.assign(querySnapshot.docs[0].data(), {}) as GamesWishlist
			if (updatedWishlist.wantedGames[gameId]) {
				delete updatedWishlist.wantedGames[gameId]
				const wishlistDocumentPath = querySnapshot.docs[0].ref.path
				const wishlistDocumentRef = doc(db, wishlistDocumentPath)
				await updateDoc(wishlistDocumentRef, updatedWishlist)
				return res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_CREATED,
					data: { wishlist: updatedWishlist }
				})
			} else {
				console.error(`Game was not in wishlist when trying to remove it. gameId ${gameId}.`)
				return res.status(400).json({
					status: APIStatuses.ERROR,
					type: GeneralAPIResponses.FAILURE,
					data: { error: `Game was not in wishlist when trying to remove it. gameId ${gameId}.` }
				})
			}
		} catch (error: any) {
			console.error(error)
			return res.status(400).json({
				status: APIStatuses.ERROR,
				type: GeneralAPIResponses.FAILURE,
				data: { error: error?.errors[0]?.longMessage ?? 'User not found.' }
			})
		}
	} else {
		console.error('Invalid request to remove from wishlist endpoint.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
})

export default handler

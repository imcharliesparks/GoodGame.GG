import firebase_app from '@/lib/firebase'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GGGame,
	GameCollection,
	GamesWishlist,
	GeneralAPIResponses
} from '@/shared/types'
import { getSafeCurrentDate } from '@/shared/utils'
import { getAuth } from '@clerk/nextjs/dist/types/server-helpers.server'
import { collection, addDoc, getDocs, getFirestore, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, method } = req
	const { userId } = getAuth(req)
	const game: GGGame = body
	const { gameId } = game

	if (!userId) {
		console.error('User not authorized.')
		return res.status(401).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'User not authorized.' }
		})
	}

	if (!game) {
		console.error('No game provided to add-to-wishlist endpoint.')
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'Game not provided to add to wishlist endpoint' }
		})
	}

	if (method === APIMethods.PATCH) {
		const updatedGame: GGGame = Object.assign(game, {
			dateAdded: getSafeCurrentDate()
		})
		try {
			const db = getFirestore(firebase_app)
			const wishlistCollectionRef = collection(db, CollectionNames.WISH_LISTS)
			const q = query(wishlistCollectionRef, where('ownerId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				const newWishlist: GamesWishlist = {
					ownerId: userId,
					wantedGames: {
						[gameId]: updatedGame
					}
				}
				await addDoc(wishlistCollectionRef, newWishlist)
				return res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_CREATED,
					data: { wishlist: newWishlist }
				})
			} else {
				// TODO: Is there a better way to to do essentially an upsert here?
				const updatedWishlist = Object.assign(querySnapshot.docs[0].data(), {}) as GamesWishlist
				updatedWishlist.wantedGames[gameId] = updatedGame
				const wishlistDocumentPath = querySnapshot.docs[0].ref.path
				const wishlistDocumentRef = doc(db, wishlistDocumentPath)
				await updateDoc(wishlistDocumentRef, updatedWishlist)
				return res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_CREATED,
					data: { wishlist: updatedWishlist }
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
		console.error('Invalid request to add-to-wishlist endpoint.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

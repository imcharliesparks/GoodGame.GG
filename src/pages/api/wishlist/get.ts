import firebase_app from '@/lib/firebase'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GamesWishlist,
	GeneralAPIResponses
} from '@/shared/types'
import { getAuth } from '@clerk/nextjs/dist/types/server-helpers.server'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

// TODO: We may not even need this anymore tbh but leaving it in now
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req
	const { userId } = getAuth(req)

	if (!userId) {
		console.error('No user id provided to my-wishlist endpoint.')
		res.status(400).json({
			status: APIStatuses.ERROR,
			type: DocumentResponses.DATA_NOT_FOUND,
			data: { error: `User ID not provided` }
		})
	}

	if (method === APIMethods.GET) {
		try {
			const db = getFirestore(firebase_app)
			const wishlistCollectionRef = collection(db, CollectionNames.COLLECTIONS)
			const q = query(wishlistCollectionRef, where('ownerId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				console.error(`No games found for wishlist. UserID: ${userId}`)
				return res.status(200).json({
					status: APIStatuses.AMBIGUOUS,
					type: GeneralAPIResponses.FAILURE,
					data: { error: `No games in wishlist found for user ${userId}` }
				})
			}

			const foundUserWishlist = Object.assign(querySnapshot.docs[0].data(), {}) as GamesWishlist
			const formattedWantedGames = []

			for (let id in foundUserWishlist.wantedGames) {
				formattedWantedGames.push(foundUserWishlist.wantedGames[id])
			}

			res.status(200).json({
				status: APIStatuses.SUCCESS,
				type: DocumentResponses.DATA_FOUND,
				data: { wishlist: formattedWantedGames }
			})
		} catch (error) {
			console.error('e', error)
			return res.status(400).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.FAILURE, data: { error } })
		}
	} else {
		console.error('Invalid request to my-wishlist endpoint.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

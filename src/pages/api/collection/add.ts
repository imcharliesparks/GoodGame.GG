import firebase_app from '@/lib/firebase'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GGGame,
	GameCollection,
	GeneralAPIResponses
} from '@/shared/types'
import { getSafeCurrentDate } from '@/shared/utils'
import { getAuth } from '@clerk/nextjs/server'
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
		console.error('No game provided to add-to-collection endpoint.')
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'Game not provided to endpoint' }
		})
	}

	if (method === APIMethods.PATCH) {
		const updatedGame: GGGame = Object.assign(game, {
			dateAdded: getSafeCurrentDate()
		})

		try {
			const db = getFirestore(firebase_app)
			const collectionsCollectionRef = collection(db, CollectionNames.COLLECTIONS)
			const q = query(collectionsCollectionRef, where('ownerId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				const newCollection: GameCollection = {
					ownerId: userId,
					ownedGames: {
						[gameId]: updatedGame
					}
				}
				await addDoc(collectionsCollectionRef, newCollection)
				return res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_CREATED,
					data: { collection: newCollection }
				})
			} else {
				// TODO: Is there a better way to to do essentially an upsert here?
				const updatedCollection = Object.assign(querySnapshot.docs[0].data(), {}) as GameCollection
				updatedCollection.ownedGames[gameId] = updatedGame
				const collectionDocumentPath = querySnapshot.docs[0].ref.path
				const collectionDocumentRef = doc(db, collectionDocumentPath)
				await updateDoc(collectionDocumentRef, updatedCollection)
				return res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_CREATED,
					data: { collection: updatedCollection }
				})
			}
		} catch (error: any) {
			console.error(error)
			return res.status(400).json({
				status: APIStatuses.ERROR,
				type: GeneralAPIResponses.FAILURE,
				data: { error: error?.errors[0]?.longMessage ?? 'General error adding game.' }
			})
		}
	} else {
		console.error('Invalid request to add-to-collection endpoint.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

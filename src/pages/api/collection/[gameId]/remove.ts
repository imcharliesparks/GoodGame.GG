import firebase_app from '@/lib/firebase'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GameCollection,
	GeneralAPIResponses
} from '@/shared/types'
import { getAuth } from '@clerk/nextjs/dist/types/server-helpers.server'
import { collection, getDocs, getFirestore, query, where, updateDoc, doc } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

// TODO: Figure out a way to make the page reload smoother (maybe route to the previous element by ID in the URL or something?)
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req
	const { userId } = getAuth(req)
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
		console.error('No game ID provided to remove from collection endpoint.')
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'Game ID not provided to endpoint' }
		})
	}

	if (method === APIMethods.DELETE) {
		try {
			const db = getFirestore(firebase_app)
			const collectionsCollectionRef = collection(db, CollectionNames.COLLECTIONS)
			const q = query(collectionsCollectionRef, where('ownerId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				console.error('Collection was empty when trying to remove a game.')
				return res.status(404).json({
					status: APIStatuses.ERROR,
					type: GeneralAPIResponses.FAILURE,
					data: { error: 'Collection not found when trying to delete.' }
				})
			}

			const updatedCollection = Object.assign(querySnapshot.docs[0].data(), {}) as GameCollection
			if (updatedCollection.ownedGames[gameId]) {
				delete updatedCollection.ownedGames[gameId]
				const collectionDocumentPath = querySnapshot.docs[0].ref.path
				const collectionDocumentRef = doc(db, collectionDocumentPath)
				await updateDoc(collectionDocumentRef, updatedCollection)
				return res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_CREATED,
					data: { collection: updatedCollection }
				})
			} else {
				console.error(`Game was not in collection when trying to remove it. gameId ${gameId}.`)
				return res.status(400).json({
					status: APIStatuses.ERROR,
					type: GeneralAPIResponses.FAILURE,
					data: { error: `Game was not in collection when trying to remove it. gameId ${gameId}.` }
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
		console.error('Invalid request to remove from collection endpoint.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

import { firebaseDB } from '@/lib/firebase'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GGGame,
	GameCollection,
	GeneralAPIResponses
} from '@/shared/types'
import { withAuth } from '@clerk/nextjs/dist/api'
import { collection, addDoc, getDocs, getFirestore, query, where, updateDoc, doc } from 'firebase/firestore'

const handler = withAuth(async (req, res) => {
	const { auth, body, method } = req
	const { userId } = auth
	const game: GGGame = body
	const { slug } = game

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
		try {
			const db = getFirestore(firebaseDB)
			const collectionsCollectionRef = collection(db, CollectionNames.COLLECTIONS)
			const q = query(collectionsCollectionRef, where('ownerId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				const newCollection: GameCollection = {
					ownerId: userId,
					ownedGames: {
						[slug]: game
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
				updatedCollection.ownedGames[slug] = game
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
				data: { error: error?.errors[0]?.longMessage ?? 'User not found.' }
			})
		}
	} else {
		console.error('Invalid request to add-to-collection endpoint.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
})

export default handler

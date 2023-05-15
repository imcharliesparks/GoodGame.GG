import { firebaseDB } from '@/lib/firebase'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GameCollection,
	GeneralAPIResponses
} from '@/shared/types'
import { withAuth } from '@clerk/nextjs/dist/api'
import { collection, getDocs, getFirestore, query, where, updateDoc, doc } from 'firebase/firestore'

// TODO: Verify that slugs are unique and this is safe (p sure they are)
// TODO: Figure out a way to make the page reload smoother (maybe route to the previous element by ID in the URL or something?)
const handler = withAuth(async (req, res) => {
	const { auth, method } = req
	const { userId } = auth
	const slug = req.query.slug as string

	if (!userId) {
		console.error('User not authorized.')
		return res.status(401).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'User not authorized.' }
		})
	}

	if (!slug) {
		console.error('No game ID provided to remove from collection endpoint.')
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'Game ID not provided to endpoint' }
		})
	}

	if (method === APIMethods.DELETE) {
		try {
			const db = getFirestore(firebaseDB)
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
			if (updatedCollection.ownedGames[slug]) {
				delete updatedCollection.ownedGames[slug]
				const collectionDocumentPath = querySnapshot.docs[0].ref.path
				const collectionDocumentRef = doc(db, collectionDocumentPath)
				await updateDoc(collectionDocumentRef, updatedCollection)
				return res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_CREATED,
					data: { collection: updatedCollection }
				})
			} else {
				console.error(`Game was not in collection when trying to remove it. Slug ${slug}.`)
				return res.status(400).json({
					status: APIStatuses.ERROR,
					type: GeneralAPIResponses.FAILURE,
					data: { error: `Game was not in collection when trying to remove it. Slug ${slug}.` }
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
})

export default handler

import { firebaseDB } from '@/lib/firebase'
import { APIMethods, APIStatuses, CollectionNames, DocumentResponses, GeneralAPIResponses } from '@/shared/types'
import { withAuth } from '@clerk/nextjs/dist/api'
import { collection, doc, getDocs, getFirestore, query, where } from 'firebase/firestore'

// TODO: We may not even need this anymore tbh but leaving it in now
const handler = withAuth(async (req, res) => {
	const { auth, method } = req
	const { userId } = auth

	if (!userId) {
		console.error('No user id provided to my-collection endpoint.')
		res.status(400).json({
			status: APIStatuses.ERROR,
			type: DocumentResponses.DATA_NOT_FOUND,
			data: { error: `User ID not provided` }
		})
	}

	if (method === APIMethods.GET) {
		try {
			const db = getFirestore(firebaseDB)
			const collectionsCollectionRef = collection(db, CollectionNames.COLLECTIONS)
			const q = query(collectionsCollectionRef, where('ownerId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				console.error(`No games found for collection. UserID: ${userId}`)
				return res.status(404).json({
					status: APIStatuses.ERROR,
					type: GeneralAPIResponses.FAILURE,
					data: { error: `No games in collection found for user ${userId}` }
				})
			}

			const foundUserCollection = Object.assign(querySnapshot.docs[0].data(), {})
			const formattedOwnedGames = []

			for (let slug in foundUserCollection.ownedGames) {
				formattedOwnedGames.push(foundUserCollection.ownedGames[slug])
			}

			res.status(200).json({
				status: APIStatuses.SUCCESS,
				type: DocumentResponses.DATA_FOUND,
				data: { collection: formattedOwnedGames }
			})
		} catch (error) {
			console.error('e', error)
			return res.status(400).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.FAILURE, data: { error } })
		}
	} else {
		console.error('Invalid request to my-collection endpoint.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
})

export default handler

import firebase_app from '@/lib/firebase'
import { APIMethods, APIStatuses, CollectionNames, DocumentResponses, GeneralAPIResponses } from '@/shared/types'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, where, getDocs, query, Timestamp, doc, updateDoc } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body } = req
	const { userId } = getAuth(req)
	const listName = req.query.listName as string
	const game_id = req.query.game_id as string

	if (!userId) {
		console.error('User is not authenticated.')
		return res.status(404).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.UNAUTHORIZED,
			data: { error: 'No game provided to search.' }
		})
	}

	if (!listName || !game_id) {
		console.error(`Request to delete game failed; game id or list name not provided`)
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.UNAUTHORIZED,
			data: { error: 'Search request body did not pass validation check' }
		})
	}

	if (method === APIMethods.DELETE) {
		const db = getFirestore(firebase_app)
		const collectionsCollectionRef = collection(db, CollectionNames.USERS)
		const q = query(collectionsCollectionRef, where('clerkId', '==', userId))
		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			console.error('User not found for delete from list endpoint.')
			return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.NOT_FOUND })
		}

		const foundUserData = querySnapshot.docs[0].data()

		if (foundUserData.lists[listName] && foundUserData.lists[listName][game_id]) {
			const updatedUserData = Object.assign({}, foundUserData)
			delete updatedUserData.lists[listName][game_id]
			updatedUserData.lists[listName].lastUpdated = Timestamp.now()
			const userDocumentPath = querySnapshot.docs[0].ref.path
			const userDocumentRef = doc(db, userDocumentPath)
			await updateDoc(userDocumentRef, updatedUserData)
			return res.status(200).json({
				status: APIStatuses.SUCCESS,
				type: DocumentResponses.DATA_DELETED,
				data: { removedGame: game_id }
			})
		} else {
			console.error('List or game not found for delete from list endpoint.')
			return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.NOT_FOUND })
		}
	} else {
		console.error('Invalid request to lists/[listName]/[game_id]/remove.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

import firebase_app from '@/lib/firebase'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GGUser,
	GeneralAPIResponses
} from '@/shared/types'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, query: urlQuery } = req
	const { userId } = getAuth(req)
	const listName = urlQuery.listName as string

	// TODO: Add this check to basically all routes
	if (!userId) {
		console.error('User not authenticated')
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.UNAUTHORIZED,
			data: { error: 'User not authenticated' }
		})
	}

	if (!listName) {
		console.error('No list name provided in URL query')
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.UNAUTHORIZED,
			data: { error: 'No list name provided in URL query' }
		})
	}

	if (method === APIMethods.DELETE) {
		try {
			const db = getFirestore(firebase_app)
			const collectionsCollectionRef = collection(db, CollectionNames.USERS)
			const q = query(collectionsCollectionRef, where('clerkId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				console.error('User not found for add to list endpoint.')
				return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.NOT_FOUND })
			}

			const updatedUser: GGUser = Object.assign({}, querySnapshot.docs[0].data()) as GGUser
			delete updatedUser.lists[listName]

			const userDocumentPath = querySnapshot.docs[0].ref.path
			const userDocumentRef = doc(db, userDocumentPath)
			await updateDoc(userDocumentRef, updatedUser)

			return res.status(200).json({
				status: APIStatuses.SUCCESS,
				type: DocumentResponses.DATA_DELETED,
				data: { updatedLists: updatedUser.lists }
			})
		} catch (error) {
			console.error(error)
			return res.status(400).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.FAILURE })
		}
	} else {
		console.error('Invalid request to lists/[listName]/delete.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

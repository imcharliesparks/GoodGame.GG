import firebase_app from '@/lib/firebase'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GGUser,
	GeneralAPIResponses
} from '@/shared/types'
import { getAuth } from '@clerk/nextjs/dist/types/server-helpers.server'
import { Timestamp, collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, query: urlQuery } = req
	const { userId } = getAuth(req)
	const listName = urlQuery.listName as string

	if (!userId) {
		console.error('User is not authenticated.')
		return res.status(404).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.UNAUTHORIZED,
			data: { error: 'No game provided to search.' }
		})
	}

	if (method === APIMethods.POST) {
		try {
			const db = getFirestore(firebase_app)
			const collectionsCollectionRef = collection(db, CollectionNames.USERS)
			const q = query(collectionsCollectionRef, where('clerkId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				console.error('User not found for create list endpoint.')
				return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.NOT_FOUND })
			}

			const updatedUser: GGUser = Object.assign({}, querySnapshot.docs[0].data()) as GGUser
			const foundList = updatedUser.lists[listName]

			if (foundList) {
				throw new Error('Attempting to create a list that already exists!')
			} else {
				// @ts-ignore
				updatedUser.lists[listName] = {
					dateAdded: Timestamp.now(),
					lastUpdated: Timestamp.now()
				}

				debugger

				const userDocumentPath = querySnapshot.docs[0].ref.path
				const userDocumentRef = doc(db, userDocumentPath)
				await updateDoc(userDocumentRef, updatedUser)

				return res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_UPDATED,
					data: { updatedList: updatedUser.lists }
				})
			}
		} catch (error) {
			console.error(error)
			return res.status(400).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.FAILURE })
		}
	} else {
		console.error('Invalid request to add friend endpoint.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

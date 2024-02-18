import firebase_app from '@/lib/firebase'
import { GameToAddToCollectionSchema } from '@/shared/ValidationSchemas'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GGList,
	GGUser,
	GeneralAPIResponses,
	StoredGame,
	TypedRequest
} from '@/shared/types'
import { getAuth } from '@clerk/nextjs/server'
import { collection, getDocs, getFirestore, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { NextApiResponse } from 'next'

const handler = async (req: TypedRequest<Omit<StoredGame, 'dateAdded'>>, res: NextApiResponse) => {
	const { method, body, query: urlQuery } = req
	const { userId } = getAuth(req)
	const listName = urlQuery.listName as string
	if (!body.moby_score) {
		delete body.moby_score
	}

	body.description = body.description ? body.description : 'No description provided'

	const { error: validationError } = GameToAddToCollectionSchema.validate(body)

	if (!userId) {
		console.error('User is not authenticated.')
		return res.status(404).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.UNAUTHORIZED,
			data: { error: 'No game provided to search.' }
		})
	}

	if (validationError || !listName) {
		console.error('Game request body did not pass validation check', validationError)
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.UNAUTHORIZED,
			data: { error: 'Search request body did not pass validation check' }
		})
	}

	if (method === APIMethods.PATCH) {
		try {
			const db = getFirestore(firebase_app)
			const collectionsCollectionRef = collection(db, CollectionNames.USERS)
			const q = query(collectionsCollectionRef, where('clerkId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				console.error('User not found for add to list endpoint.')
				return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.NOT_FOUND })
			}

			const addedGame: StoredGame = Object.assign({ dateAdded: Timestamp.now() }, body)
			console.log('addedGame', addedGame)
			const updatedUser: GGUser = Object.assign({}, querySnapshot.docs[0].data()) as GGUser
			const foundList = updatedUser.lists[listName]

			if (foundList) {
				updatedUser.lists[listName][addedGame.game_id.toString()] = addedGame
				updatedUser.lists[listName].lastUpdated = Timestamp.now()
			} else {
				// @ts-ignore
				updatedUser.lists[listName] = {
					[addedGame.game_id.toString()]: addedGame,
					dateAdded: Timestamp.now(),
					lastUpdated: Timestamp.now()
				}
			}

			const userDocumentPath = querySnapshot.docs[0].ref.path
			const userDocumentRef = doc(db, userDocumentPath)
			await updateDoc(userDocumentRef, updatedUser)

			return res.status(200).json({
				status: APIStatuses.SUCCESS,
				type: DocumentResponses.DATA_UPDATED,
				data: { updatedList: updatedUser.lists }
			})
		} catch (error) {
			console.error(error)
			return res.status(400).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.FAILURE })
		}
	} else {
		console.error('Invalid request to lists/[listName]/update.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

import firebase_app from '@/lib/firebase'
import { GameToAddToCollectionSchema } from '@/shared/ValidationSchemas'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GGUser,
	GeneralAPIResponses,
	StoredGame,
	TypedRequest
} from '@/shared/types'
import { getAuth } from '@clerk/nextjs/server'
import { collection, getDocs, getFirestore, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { NextApiResponse } from 'next'

// START HERE: Validate that we hit all cases
const handler = async (req: TypedRequest<Omit<StoredGame, 'dateAdded'>>, res: NextApiResponse) => {
	const { method, body, query: urlQuery } = req
	const { userId } = getAuth(req)
	const listName = urlQuery.listName as string
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
		console.error('Game request body did not pass validation check')
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.UNAUTHORIZED,
			data: { error: 'Search request body did not pass validation check' }
		})
	}

	if (method === APIMethods.POST) {
		try {
			const db = getFirestore(firebase_app)
			const collectionsCollectionRef = collection(db, CollectionNames.USERS)
			const q = query(collectionsCollectionRef, where('clerkId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				console.error('User not found for add to collection endpoint.')
				return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.NOT_FOUND })
			}

			const updatedGame: StoredGame = Object.assign({ dateAdded: Timestamp.now() }, body)
			const updatedUser: GGUser = Object.assign({}, querySnapshot.docs[0].data()) as GGUser

			if (updatedUser.lists[listName]) {
				// @ts-ignore
				if (updatedUser.lists[listName][updatedGame.game_id.toString()]) {
					console.error('This game already exists in the users') // TODO: Should we remove?
					return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.NOT_FOUND })
				} else {
					// @ts-ignore
					updatedUser.lists[listName][updatedGame.game_id.toString()] = updatedGame
				}
			} else {
				// @ts-ignore
				updatedUser.lists[listName] = {
					[updatedGame.game_id.toString()]: updatedGame
				}
			}

			const userDocumentPath = querySnapshot.docs[0].ref.path
			const userDocumentRef = doc(db, userDocumentPath)
			await updateDoc(userDocumentRef, updatedUser)
			return res.status(200).json({
				status: APIStatuses.SUCCESS,
				type: DocumentResponses.DATA_CREATED,
				data: { user: updatedUser }
			})
		} catch (error) {
			console.error(error)
			return res.status(400).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.FAILURE })
		}
	} else {
		console.error('Invalid request to lists/[listName]/add.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

import firebase_app from '@/lib/firebase'
import { APIMethods, APIStatuses, CollectionNames, GeneralAPIResponses, StoredGame } from '@/shared/types'
import { convertFirebaseTimestamps } from '@/shared/utils'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, where, getDocs, query } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, query: queryString } = req
	const { userId } = getAuth(req)

	if (!userId) {
		console.error('User is not authenticated.')
		return res.status(404).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.UNAUTHORIZED,
			data: { error: 'No game provided to search.' }
		})
	}

	if (method === APIMethods.GET) {
		const db = getFirestore(firebase_app)
		const userCollectionRef = collection(db, CollectionNames.USERS)
		const q = query(userCollectionRef, where('clerkId', '==', userId))
		const querySnapshot = await getDocs(q)
		if (querySnapshot.empty) {
			console.error('Non logged in user accessing search')
		} else {
			const { lists } = Object.assign(querySnapshot.docs[0].data(), {})

			if (Object.keys(lists).length) {
				for (const listName in lists) {
					convertFirebaseTimestamps(lists[listName])
				}

				return res.status(200).json({ data: lists })
			} else {
				console.error(`No lists found for user ${userId}`)
				return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.NOT_FOUND })
			}

			console.log('lists', lists)

			// if (lists[listName]) {
			// 	const foundGames: StoredGame[] = []

			// 	for (let game_id in lists[listName]) {
			// 		foundGames.push(lists[listName][game_id])
			// 	}

			// 	props.foundGames = foundGames
			// 	props.lists = lists
			// } else {
			// 	props.error = `The user does not have a list called ${listName}`
			// }
		}
	} else {
		console.error('Invalid request to get all games')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

import firebase_app from '@/lib/firebase'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GGUsername,
	GeneralAPIResponses
} from '@/shared/types'
import { generateUsername } from '@/shared/utils'
import { User, clerkClient } from '@clerk/nextjs/dist/types/server'
import { collection, getFirestore, where, query as dbQuery, getDocs, addDoc } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

// TODO: Eventually handle the case where username is undefined here
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, query } = req
	const clerkId = query.clerkId as string

	if (!clerkId) {
		console.error('User not authorized.')
		return res.status(401).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'User not authorized.' }
		})
	}

	if (method === APIMethods.POST) {
		try {
			const foundUser: User = await clerkClient.users.getUser(clerkId)

			if (foundUser) {
				const db = getFirestore(firebase_app)
				const usernamesCollectionRef = collection(db, CollectionNames.USERNAMES)

				const q = dbQuery(usernamesCollectionRef, where('ownerId', '==', clerkId))
				const querySnapshot = await getDocs(q)

				if (querySnapshot.empty && foundUser.username) {
					const newUsername: GGUsername = {
						ownerId: clerkId,
						username: generateUsername(foundUser.username!)
					}
					await addDoc(usernamesCollectionRef, newUsername)

					return res.status(200).json({
						status: APIStatuses.SUCCESS,
						type: DocumentResponses.DATA_CREATED,
						data: { username: newUsername.username }
					})
				} else {
					return res.status(200).json({
						status: APIStatuses.AMBIGUOUS,
						type: GeneralAPIResponses.FAILURE,
						data: {
							error: `Unable to create username. Either clerk username was undefined, or the username already exists. UserID: ${clerkId}.`
						}
					})
				}
			} else {
				throw new Error(`User not found with ID ${clerkId}`)
			}
		} catch (error) {
			return res.status(400).json({
				status: APIStatuses.ERROR,
				type: GeneralAPIResponses.FAILURE,
				data: { error: 'Unable to create user.' }
			})
		}
	} else {
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

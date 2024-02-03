import firebase_app from '@/lib/firebase'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	GGUser,
	GGUsername,
	GeneralAPIResponses,
	TypedRequest
} from '@/shared/types'
import { generateUsername } from '@/shared/utils'
import { User, clerkClient } from '@clerk/nextjs/server'
import { collection, getFirestore, where, query as dbQuery, getDocs, addDoc } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

// TODO: Eventually handle the case where username is undefined here
const handler = async (req: TypedRequest<User>, res: NextApiResponse) => {
	const { method, query, body: user } = req
	const clerkId = query.clerkId as string
	const { firstName, lastName, externalAccounts } = user
	const { emailAddress, username } = externalAccounts[0]

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
			const foundUser = await clerkClient.users.getUser(clerkId)

			// TODO validate that this works
			if (foundUser) {
				const db = getFirestore(firebase_app)
				const usersCollectionRef = collection(db, CollectionNames.USERS)
				const newUserEntry: GGUser = {
					clerkId,
					emailAddress,
					firstName: firstName ?? '',
					lastName: lastName ?? '',
					username: username ?? '',
					friendIds: [],
					lists: {
						// @ts-ignore
						['Collection']: [],
						// @ts-ignore
						['Backlog']: []
					}
				}

				await addDoc(usersCollectionRef, newUserEntry)
				await clerkClient.users.updateUser(clerkId, {
					privateMetadata: { ...foundUser.privateMetadata, hasSignedUp: true }
				})

				return res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_CREATED
				})
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

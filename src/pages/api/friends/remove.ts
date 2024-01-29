import firebase_app from '@/lib/firebase'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	DocumentResponses,
	Friend,
	GeneralAPIResponses,
	UserFriendsList
} from '@/shared/types'
import { getAuth } from '@clerk/nextjs/dist/types/server-helpers.server'
import { collection, addDoc, getDocs, getFirestore, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, method } = req
	const { userId } = getAuth(req)
	const { friendId } = body

	if (!userId) {
		console.error('User not authorized.')
		return res.status(401).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'User not authorized.' }
		})
	}

	if (!friendId) {
		console.error('No friend id provided to remove-friend endpoint.')
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'No friend id provided to remove-friend endpoint' }
		})
	}

	if (method === APIMethods.PATCH) {
		try {
			const db = getFirestore(firebase_app)
			const friendslistCollectionRef = collection(db, CollectionNames.FRIENDS_LISTS)
			const q = query(friendslistCollectionRef, where('ownerId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				return res.status(404).json({
					status: APIStatuses.ERROR,
					type: DocumentResponses.DATA_NOT_FOUND,
					data: { error: 'Friendslist not found for user' }
				})
			} else {
				const foundFriendsList = Object.assign(querySnapshot.docs[0].data(), {}) as UserFriendsList
				const updatedFriendsList = foundFriendsList.friends.filter((friend: Friend) => {
					if (friend.id !== friendId) return friend
				})
				const updatedFriendslistDocument = {
					ownerId: userId,
					friends: updatedFriendsList
				}

				const friendslistDocumentPath = querySnapshot.docs[0].ref.path
				const friendslistDocumentRef = doc(db, friendslistDocumentPath)
				await updateDoc(friendslistDocumentRef, updatedFriendslistDocument)
				return res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_UPDATED,
					data: { friendslist: updatedFriendsList }
				})
			}
		} catch (error: any) {
			console.log('error', error)
			console.error(error)
			return res.status(400).json({
				status: APIStatuses.ERROR,
				type: GeneralAPIResponses.FAILURE,
				data: { error: error?.errors[0]?.longMessage ?? 'Unable to add friend.' }
			})
		}
	} else {
		console.log(4)
		console.error('Invalid request to add friend endpoint.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

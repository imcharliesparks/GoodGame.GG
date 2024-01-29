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
import { getSafeCurrentDate } from '@/shared/utils'
import { User, getAuth } from '@clerk/nextjs/server'
import { collection, addDoc, getDocs, getFirestore, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, method } = req
	const { userId } = getAuth(req)
	const friendToAdd: User = body as User
	const { id } = friendToAdd

	if (!userId) {
		console.error('User not authorized.')
		return res.status(401).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'User not authorized.' }
		})
	}

	if (!friendToAdd) {
		console.error('No friend provided to add-friend endpoint.')
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'Friend not provided to add-friend endpoint' }
		})
	}

	if (method === APIMethods.PATCH) {
		// TODO: We really need to fine tune a tweak this data shape
		const newFriend: Friend = {
			id: id,
			firstName: friendToAdd.firstName ?? 'No name provided',
			dateAdded: getSafeCurrentDate(),
			mutual: true
		}
		try {
			const db = getFirestore(firebase_app)
			const friendslistCollectionRef = collection(db, CollectionNames.FRIENDS_LISTS)
			const q = query(friendslistCollectionRef, where('ownerId', '==', userId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				const newFriendslist: UserFriendsList = {
					ownerId: userId,
					friends: [newFriend]
				}
				await addDoc(friendslistCollectionRef, newFriendslist)
				return res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_CREATED,
					data: { wishlist: newFriendslist }
				})
			} else {
				const updatedFriendslist = Object.assign(querySnapshot.docs[0].data(), {}) as UserFriendsList
				const alreadyHaveFriend = updatedFriendslist.friends.find((friend) => friend.id === id)

				if (alreadyHaveFriend) {
					console.error('Friend already added!')
					return res.status(400).json({
						status: APIStatuses.ERROR,
						type: GeneralAPIResponses.FAILURE,
						data: { error: 'Friend already added to friendslist.' }
					})
				}

				updatedFriendslist.friends.push(newFriend)
				const friendslistDocumentPath = querySnapshot.docs[0].ref.path
				const friendslistDocumentRef = doc(db, friendslistDocumentPath)
				await updateDoc(friendslistDocumentRef, updatedFriendslist)
				return res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_UPDATED,
					data: { friendslist: updatedFriendslist }
				})
			}
		} catch (error: any) {
			console.error(error)
			return res.status(400).json({
				status: APIStatuses.ERROR,
				type: GeneralAPIResponses.FAILURE,
				data: { error: error?.errors[0]?.longMessage ?? 'Unable to add friend.' }
			})
		}
	} else {
		console.error('Invalid request to add friend endpoint.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

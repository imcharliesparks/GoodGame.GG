import firebase_app from '@/lib/firebase'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { CollectionNames } from './types'

export const getGameByListName = async (listName: string, game_id: string, clerkId: string) => {
	const db = getFirestore(firebase_app)
	const collectionsCollectionRef = collection(db, CollectionNames.USERS)
	const q = query(collectionsCollectionRef, where('clerkId', '==', clerkId))
	const querySnapshot = await getDocs(q)

	if (querySnapshot.empty) {
		throw new Error('No game was found with these parameters, please try again.')
	}

	const foundUserData = querySnapshot.docs[0].data()

	if (foundUserData.lists[listName][game_id]) {
		return foundUserData.lists[listName][game_id]
	} else {
		throw new Error('No game was found with these parameters, please try again.')
	}
}

import firebase_app from '@/lib/firebase'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { CollectionNames } from './types'
import { convert } from 'html-to-text'

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

// TODO: Refactor to hit our service eventually
export const getGameByGameId = async (game_id: string) => {
	let reqUrl = `https://api.mobygames.com/v1/games/${game_id}?format=normal&api_key=${process.env.MOBY_GAMES_API_KEY}`
	const request = await fetch(reqUrl)
	const response = await request.json()

	if (response && response.title) {
		const payload = {
			...response,
			description: response.description
				? convert(
						response.description,
						{ selectors: [{ selector: 'a', options: { ignoreHref: true } }] },
						{ selector: 'img', options: { ignoreHref: true } }
				  )
				: ''
		}
		return payload
	} else {
		throw new Error('No game found by that ID')
	}
}

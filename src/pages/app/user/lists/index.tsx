import firebase_app from '@/lib/firebase'
import { CollectionNames, GGLists, UserLists } from '@/shared/types'
import { convertFirebaseTimestamps } from '@/shared/utils'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import { Props } from 'next/script'
import React from 'react'

type UserListsPageProps = {
	dataFetchingError?: string
	lists: GGLists
}

const UserListsPage = ({ dataFetchingError, lists }: UserListsPageProps) => {
	return <div>UserListsPage</div>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { userId } = getAuth(ctx.req)
	const props: UserListsPageProps = {
		dataFetchingError: '',
		lists: {}
	}
	try {
		const db = getFirestore(firebase_app)
		const collectionsCollectionRef = collection(db, CollectionNames.USERS)
		const q = query(collectionsCollectionRef, where('clerkId', '==', userId))
		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			console.error(`No games found for collection. UserID: ${userId}`)
		} else {
			const formattedLists = Object.assign(querySnapshot.docs[0].data().lists, {})
			for (const listName in formattedLists) {
				convertFirebaseTimestamps(formattedLists[listName])
			}

			props.lists = formattedLists
		}
	} catch (error) {
		console.error('e', error)
		props.dataFetchingError = 'There was an error fetching your collection! Please try again.'
	} finally {
		return {
			props
		}
	}
}

export default UserListsPage

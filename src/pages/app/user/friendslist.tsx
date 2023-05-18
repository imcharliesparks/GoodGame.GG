import FriendslistCard from '@/components/general/FriendsListCard'
import { firebaseDB } from '@/lib/firebase'
import { CollectionNames, Friend, GGGame, UserFriendsList } from '@/shared/types'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import React from 'react'

type Props = {
	friendslist: UserFriendsList
	dataFetchingError: string
}

// TODO: Intercept fetching with loading screen
// TODO: Copy game collection on load into local state and make removal work instantly without a refetch
const MyFriendslistPage = ({ friendslist, dataFetchingError }: Props) => {
	const [error, setError] = React.useState<string>(dataFetchingError.length ? dataFetchingError : '')
	const { friends } = friendslist

	const handleShowError = (message: string) => {
		setError(message)
		setTimeout(() => {
			setError('')
		}, 5000)
	}

	return (
		<div className="max-w-screen flex flex-col items-center py-6">
			<div className="container text-center">
				<h1 className="font-bold text-3xl mb-2">My Friends</h1>
				<div className="container w-full flex flex-col">
					{friends?.length ? (
						friends?.map((friend: Friend) => (
							<FriendslistCard key={friend.id} friend={friend} handleShowError={handleShowError} />
						))
					) : (
						<h1>You haven't added any friends yet!</h1>
					)}
				</div>
			</div>
			{error && (
				<div className="toast toast-center min-w-max z-50">
					<div className="alert alert-error">
						<div>
							<span>{error}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { userId } = getAuth(ctx.req)
	const props: Props = {
		dataFetchingError: '',
		friendslist: {
			ownerId: userId!,
			friends: []
		}
	}
	try {
		const db = getFirestore(firebaseDB)
		const collectionsCollectionRef = collection(db, CollectionNames.FRIENDS_LISTS)
		const q = query(collectionsCollectionRef, where('ownerId', '==', userId))
		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			console.error(`No friendslist found for UserID: ${userId}`)
		} else {
			props.friendslist.friends = querySnapshot.docs[0].data().friends
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

export default MyFriendslistPage

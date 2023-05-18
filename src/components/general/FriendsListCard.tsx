import { APIMethods, APIStatuses, Friend } from '@/shared/types'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useRouter } from 'next/router'
import { getReleaseDateFromUTC } from '@/shared/utils'

type UserCardProps = {
	friend: Friend
	handleShowError: (message: string) => void
}

// TODO: Add placecard//skelleton UI for when there is no cover art
// TODO: As part of the intake refactor, prompt users if they already have the user as a friend (or just don't show the user)
// TODO: Differentiate the buttons if the user already has an item in collection/wishlist
const FriendslistCard = ({ friend, handleShowError }: UserCardProps) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)

	const handleRemoveFriend = async (friend: Friend) => {
		setIsLoading(true)

		try {
			const request = await fetch(`/api/friends/remove`, {
				method: APIMethods.PATCH,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ friendId: friend.id })
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				router.replace(router.asPath)
			}
		} catch (error) {
			console.error(`Unable to remove friend.`, error)
			handleShowError(`Couldn't remove this friend! Please try again in a bit.`)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="card bg-base-100 shadow-xl text-black mt-4 mx-auto w-fit max-w-[400px]">
			{/* TODO: Add pfp */}
			<div className="card-body items-center text-center pt-3">
				<h2 className="card-title">{friend.firstName}</h2>
				<p>Friends since {getReleaseDateFromUTC(friend.dateAdded)}</p>
				<div className="card-actions pt-3">
					<button onClick={() => handleRemoveFriend(friend)} className="btn btn-primary w-[137px]">
						{isLoading ? <LoadingSpinner /> : '- Friend'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default FriendslistCard

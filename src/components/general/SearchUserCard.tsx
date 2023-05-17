import { APIMethods, APIStatuses } from '@/shared/types'
import Image from 'next/image'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import { User } from '@clerk/nextjs/server'

type UserCardProps = {
	user: User
	handleAddSuccessTest: (message: string) => void
	handleShowError: (message: string) => void
}

// TODO: Add placecard//skelleton UI for when there is no cover art
// TODO: As part of the intake refactor, prompt users if they already have the user as a friend (or just don't show the user)
// TODO: Differentiate the buttons if the user already has an item in collection/wishlist
const SearchUserCard = ({ user, handleAddSuccessTest, handleShowError }: UserCardProps) => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const dropdownRef = React.useRef(null)

	const handleDropdownClick = () => {
		const elem = document.activeElement as HTMLLinkElement

		if (elem) {
			elem?.blur()
		}
	}

	const handleAddFriend = async (user: User) => {
		console.log('user', user)
		handleDropdownClick()
		setIsLoading(true)
		try {
			const request = await fetch(`/api/users/add`, {
				method: APIMethods.PATCH,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				handleAddSuccessTest('Friend request sent!')
			}
		} catch (error) {
			console.error(`Unable to send friend request.`, error)
			handleShowError(`Couldn't send your friend request! Please try again in a bit.`)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="card bg-base-100 shadow-xl text-black mt-4 mx-auto w-fit max-w-[400px]">
			{/* TODO: Add pfp */}
			<div className="card-body items-center text-center pt-3">
				<h2 className="card-title">{user.firstName}</h2>
				<p>{user.emailAddresses[0].emailAddress}</p>
				<div className="card-actions pt-3">
					<button onClick={() => handleAddFriend(user)} className="btn btn-primary w-[137px]">
						{isLoading ? <LoadingSpinner /> : '+ Friend'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default SearchUserCard

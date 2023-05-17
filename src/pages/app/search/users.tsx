import React from 'react'
import { APIMethods, APIStatuses, GGGame, GamePlayStatus } from '@/shared/types'
import SearchGameCard from '@/components/general/SearchGameCard'
import LoadingSpinner from '@/components/general/LoadingSpinner'
import { User } from '@clerk/nextjs/server'
import SearchUserCard from '@/components/general/SearchUserCard'

// TODO: Disallow adding of friends once the user already has them on their list
const SearchUsersPage = () => {
	const inputRef = React.useRef<HTMLInputElement | null>(null)
	const [searchError, setSearchError] = React.useState<string | null>(null)
	const [addSuccessText, setAddSuccessText] = React.useState<string | null>(null)
	const [users, setUsers] = React.useState<User[]>()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)

	const handleShowError = (errorText: string) => {
		setSearchError(errorText)
		setTimeout(() => {
			setSearchError(null)
		}, 5000)
	}

	const handleAddSuccessText = (successText: string) => {
		setAddSuccessText(successText)
		setTimeout(() => {
			setAddSuccessText(null)
		}, 5000)
	}

	const handleSearch = async () => {
		if (!inputRef.current?.value) {
			handleShowError('Enter an email address!')
		} else {
			setIsLoading(true)
			try {
				const request = await fetch(`/api/users/email/${inputRef.current.value}`, {
					method: APIMethods.GET,
					headers: {
						'Content-Type': 'application/json'
					}
				})
				const response = await request.json()
				if (response.status === APIStatuses.ERROR) {
					throw new Error(response.data.error)
				} else {
					setUsers(response.data.users)
				}
			} catch (error) {
				console.error(`Could not find a game with the name ${inputRef.current.value}`, error)
				handleShowError(`We couldn't find a game by that name!`)
			} finally {
				setIsLoading(false)
			}
		}
	}

	return (
		<div className="max-w-screen flex flex-col items-center py-6">
			<div className="container">
				<form
					className="mx-auto w-full flex flex-col md:flex-row justify-center items-center"
					onSubmit={(e) => {
						e.preventDefault()
						handleSearch()
					}}
				>
					<input
						ref={inputRef}
						type="text"
						placeholder="Search for a user by email..."
						className="input input-primary w-full max-w-xs text-black"
					/>
					<button type="submit" className="btn  btn-primary ml-0 mt-3 md:ml-2 md:mt-0">
						{isLoading ? <LoadingSpinner /> : 'Search'}
					</button>
				</form>
				<div className="container w-full flex flex-col">
					{users?.map((user) => (
						<SearchUserCard
							key={user.id}
							user={user}
							handleAddSuccessTest={handleAddSuccessText}
							handleShowError={handleShowError}
						/>
					))}
				</div>
			</div>
			{searchError && (
				<div className="toast toast-center min-w-max z-50">
					<div className="alert alert-error">
						<div>
							<span>{searchError}</span>
						</div>
					</div>
				</div>
			)}
			{addSuccessText && (
				<div className="toast toast-center min-w-max z-50">
					<div className="alert alert-success">
						<div>
							<span>{addSuccessText}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default SearchUsersPage

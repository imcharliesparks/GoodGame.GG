import React from 'react'
import { APIMethods, APIStatuses, GGGame } from '@/shared/types'
import GameCard from '@/components/general/GameCard'
import LoadingSpinner from '@/components/general/LoadingSpinner'

// TODO: Slim down requests by refactoring so we only send the three properties we need of game in these api patch requests
const SearchGamesPage = () => {
	const inputRef = React.useRef<HTMLInputElement | null>(null)
	const [searchError, setSearchError] = React.useState<string | null>(null)
	const [addSuccessText, setAddSuccessText] = React.useState<string | null>(null)
	const [games, setGames] = React.useState<GGGame[]>()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)

	const handleShowError = (errorText: string) => {
		setSearchError(errorText)
		setTimeout(() => {
			setSearchError(null)
		}, 5000)
	}

	const handleAddSuccessTest = (successText: string) => {
		setAddSuccessText(successText)
		setTimeout(() => {
			setAddSuccessText(null)
		}, 5000)
	}

	const handleSearch = async () => {
		if (!inputRef.current?.value) {
			handleShowError('Enter a search term!')
		} else {
			setIsLoading(true)
			try {
				const request = await fetch(`/api/games/${inputRef.current.value}/search-games`, {
					method: APIMethods.POST,
					headers: {
						'Content-Type': 'application/json'
					}
				})
				const response = await request.json()
				if (response.status === APIStatuses.ERROR) {
					throw new Error(response.data.error)
				} else {
					setGames(response.data)
				}
			} catch (error) {
				console.error(`Could not find a game with the name ${inputRef.current.value}`, error)
				handleShowError(`We couldn't find a game by that name!`)
			} finally {
				setIsLoading(false)
			}
		}
	}

	// TODO: Need to find a way to update the button so it shows as in collection now
	const handleAddToCollection = async (game: GGGame) => {
		setIsLoading(true)
		try {
			const request = await fetch(`/api/games/add-to-collection`, {
				method: APIMethods.PATCH,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(game)
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				handleAddSuccessTest('Success! Game added to collection.')
			}
		} catch (error) {
			console.error(`Unable to add game to collection.`, error)
			handleShowError(`Couldn't add that game to your collection! Please try again in a bit.`)
		} finally {
			setIsLoading(false)
		}
	}

	const handleAddToWishlist = async (game: GGGame) => {
		console.log('cheese')
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
						placeholder="Search for a game..."
						className="input input-primary w-full max-w-xs text-black"
					/>
					<button type="submit" className="btn  btn-primary ml-0 mt-3 md:ml-2 md:mt-0">
						{isLoading ? <LoadingSpinner /> : 'Search'}
					</button>
				</form>
				<div className="container w-full flex flex-col">
					{games?.map((game) => (
						<GameCard
							key={game.gameId}
							game={game}
							addToCollection={() => handleAddToCollection(game)}
							addToWishlist={() => handleAddToWishlist(game)}
							isLoading={isLoading}
						/>
					))}
				</div>
			</div>
			{searchError && (
				<div className="toast toast-center min-w-max">
					<div className="alert alert-error">
						<div>
							<span>{searchError}</span>
						</div>
					</div>
				</div>
			)}
			{addSuccessText && (
				<div className="toast toast-center min-w-max">
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

export default SearchGamesPage

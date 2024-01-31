import React from 'react'
import { APIMethods, APIStatuses, GGGame, GamePlayStatus, MobyGame } from '@/shared/types'
import SearchGameCard from '@/components/general/SearchGameCard'
import LoadingSpinner from '@/components/general/LoadingSpinner'
import NewSearchGameCard from '@/components/general/NewSearchGameCard'

// TODO: Disallow adding of games once the user already has them
// TODO: Add pagination to search for speed
const SearchGamesPage = () => {
	const inputRef = React.useRef<HTMLInputElement | null>(null)
	const [searchError, setSearchError] = React.useState<string | null>(null)
	const [addSuccessText, setAddSuccessText] = React.useState<string | null>(null)
	const [games, setGames] = React.useState<MobyGame[]>()
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
				// TODO: Add filtering for genre and platform
				const payload = {
					title: inputRef?.current.value
				}
				const request = await fetch(`/api/games/search`, {
					method: APIMethods.POST,
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(payload)
				})
				const response = await request.json()
				console.log('response', response)
				if (response.status === APIStatuses.ERROR) {
					throw new Error(response.data.error)
				} else {
					setGames(response.data.games)
				}
			} catch (error) {
				console.error(`Could not find a game with the name ${inputRef.current.value}`, error)
				handleShowError(`We couldn't find a game by that name!`)
			} finally {
				setIsLoading(false)
			}
		}
	}
	// const handleSearch = async () => {
	// 	if (!inputRef.current?.value) {
	// 		handleShowError('Enter a search term!')
	// 	} else {
	// 		setIsLoading(true)
	// 		try {
	// 			const request = await fetch(`/api/games/${inputRef.current.value}/search`, {
	// 				method: APIMethods.POST,
	// 				headers: {
	// 					'Content-Type': 'application/json'
	// 				}
	// 			})
	// 			const response = await request.json()
	// 			if (response.status === APIStatuses.ERROR) {
	// 				throw new Error(response.data.error)
	// 			} else {
	// 				setGames(response.data.foundGames)
	// 			}
	// 		} catch (error) {
	// 			console.error(`Could not find a game with the name ${inputRef.current.value}`, error)
	// 			handleShowError(`We couldn't find a game by that name!`)
	// 		} finally {
	// 			setIsLoading(false)
	// 		}
	// 	}
	// }

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
					{/* {games?.map((game) => (
						<SearchGameCard
							key={game.gameId}
							game={game}
							handleAddSuccessTest={handleAddSuccessTest}
							handleShowError={handleShowError}
						/>
					))} */}
					{games?.map((game) => (
						<NewSearchGameCard key={game.game_id} game={game} />
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

export default SearchGamesPage

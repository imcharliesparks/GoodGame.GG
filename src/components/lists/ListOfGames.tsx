import React from 'react'
import HorizontalScroll from '../general/HorizontalScroll'
import { APIMethods, APIStatuses, GGList, StoredGame } from '@/shared/types'
import ListCard from '../general/ListCard'
import NewGameCard from '../Games/NewGameCard'
import { useRouter } from 'next/router'
import RemoveFromListDialog from '../Dialogs/RemoveFromListDialog'

type ListOfGamesProps = {
	list: GGList
	listName: string
}

// TODO: Only use the horizontal scroll on mobile probably
const ListOfGames = ({ list, listName }: ListOfGamesProps) => {
	const router = useRouter()
	const [games, setGames] = React.useState<StoredGame[]>([])
	const [currentlySelectedGame, setCurrentlySelectedGame] = React.useState<StoredGame>()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [showRemoveFromListDialog, setShowRemoveFromListDialog] = React.useState<boolean>(false)

	const toggleRemoveFromListDialog = (isOpen?: boolean) =>
		setShowRemoveFromListDialog(isOpen ?? !showRemoveFromListDialog)

	// TODO: Extract this out
	const removeFromList = async (game_id: number, currentListName: string) => {
		setIsLoading(true)
		try {
			const request = await fetch(`/api/lists/${currentListName}/${game_id}/remove`, {
				method: APIMethods.DELETE,
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				// TODO: Update with alert from material
				alert(`Success! We removed the game.`)
				toggleRemoveFromListDialog()
				// CS NOTE: This is the pattern for refreshing GSSP data 😬
				router.replace(router.asPath)
			}
		} catch (error) {
			console.error(`Could not delete game with gameId ${game_id}`, error)
			// TODO: Update with alert from material
			alert(`We couldn't remove that game! Please try again.`)
			// setError(`We couldn't remove that game! Please try again.`)
			// setTimeout(() => {
			// 	setError('')
			// }, 6000)
		} finally {
			setIsLoading(false)
		}
	}

	React.useEffect(() => {
		const gameIds = Object.keys(list)
		const games = gameIds.map((gameId: string) => list[gameId])
		setGames(games)
	}, [list])
	return (
		<div>
			<h3 className="text-3xl text-center">{listName}</h3>
			{games.length ? (
				<HorizontalScroll>
					{games.map(
						(game: StoredGame) =>
							typeof game !== 'string' && (
								<NewGameCard
									game={game}
									listName={listName}
									toggleRemoveFromListDialog={toggleRemoveFromListDialog}
									setCurrentlySelectedGame={setCurrentlySelectedGame}
									classes="mr-2"
								/>
							)
					)}
				</HorizontalScroll>
			) : (
				// TODO: Do something better tbh
				<h1 className="text-center mt-4">No games added to this list yet!</h1>
			)}
			{currentlySelectedGame && (
				<RemoveFromListDialog
					isOpen={showRemoveFromListDialog}
					gameName={currentlySelectedGame.title}
					listName={listName}
					isDeleteButtonLoading={isLoading}
					handler={toggleRemoveFromListDialog}
					handleRemoveFromList={() => removeFromList(currentlySelectedGame.game_id, listName)}
				/>
			)}
		</div>
	)
}

export default ListOfGames

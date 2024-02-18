import React from 'react'
import HorizontalScroll from '../general/HorizontalScroll'
import { GGList, StoredGame } from '@/shared/types'
import NewGameCard from '../Games/NewGameCard'

type ListOfGamesProps = {
	list: GGList
	listName: string
}

// TODO: Only use the horizontal scroll on mobile probably
const ListOfGames = ({ list, listName }: ListOfGamesProps) => {
	const [games, setGames] = React.useState<StoredGame[]>([])
	const [showRemoveFromListDialog, setShowRemoveFromListDialog] = React.useState<boolean>(false)
	const [showUpdateGameDialog, setShowUpdateGameDialog] = React.useState<boolean>(false)

	const toggleRemoveFromListDialog = (isOpen?: boolean) =>
		setShowRemoveFromListDialog(isOpen ?? !showRemoveFromListDialog)

	const toggleUpdateGameDialog = (isOpen?: boolean) => setShowUpdateGameDialog(isOpen ?? !showUpdateGameDialog)

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
						(game: StoredGame, i: number) =>
							typeof game !== 'string' && (
								<NewGameCard
									key={`${game.game_id}_${i}`}
									gameFromList={game}
									toggleRemoveFromListDialog={toggleRemoveFromListDialog}
									toggleUpdateGameDialog={toggleUpdateGameDialog}
									classes="mr-2"
								/>
							)
					)}
				</HorizontalScroll>
			) : (
				// TODO: Do something better tbh
				<h1 className="text-center mt-4">No games added to this list yet!</h1>
			)}
			{/* <RemoveFromListDialog isOpen={showRemoveFromListDialog} setIsDialogOpen={toggleRemoveFromListDialog} /> */}
		</div>
	)
}

export default ListOfGames

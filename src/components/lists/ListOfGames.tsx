import React from 'react'
import HorizontalScroll from '../general/HorizontalScroll'
import { GGList, StoredGame } from '@/shared/types'
import ListCard from '../general/ListCard'

type ListOfGamesProps = {
	list: GGList
	listName: string
}

const ListOfGames = ({ list, listName }: ListOfGamesProps) => {
	const [games, setGames] = React.useState<StoredGame[]>([])

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
								<ListCard
									listName={listName}
									key={`${listName}_${game.game_id}`}
									game={game}
									setError={() => console.log('oh no')}
								/>
							)
					)}
				</HorizontalScroll>
			) : (
				// TODO: Do something better tbh
				<h1 className="text-center mt-4">No games added to this list yet!</h1>
			)}
		</div>
	)
}

export default ListOfGames

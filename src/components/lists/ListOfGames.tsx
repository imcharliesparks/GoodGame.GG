import React from 'react'
import HorizontalScroll from '../general/HorizontalScroll'
import NewCollectionGameCard from '../general/NewCollectionGameCard'
import { GGList, StoredGame } from '@/shared/types'

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
			<HorizontalScroll>
				{games.map((game: StoredGame) => (
					<NewCollectionGameCard key={`${listName}_${game.game_id}`} game={game} setError={() => console.log('oh no')} />
				))}
			</HorizontalScroll>
		</div>
	)
}

export default ListOfGames

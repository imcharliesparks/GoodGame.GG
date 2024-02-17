import React from 'react'
import HorizontalScroll from '../general/HorizontalScroll'
import { APIMethods, APIStatuses, GGList, StoredGame } from '@/shared/types'
import ListCard from '../general/ListCard'
import NewGameCard from '../Games/NewGameCard'
import { useRouter } from 'next/router'
import RemoveFromListDialog from '../Dialogs/RemoveFromListDialog'
import { useCurrentlySelectedGame } from '../hooks/useStateHooks'

type ListOfGamesProps = {
	list: GGList
	listName: string
}

// TODO: Only use the horizontal scroll on mobile probably
const ListOfGames = ({ list, listName }: ListOfGamesProps) => {
	const [games, setGames] = React.useState<StoredGame[]>([])
	const [showRemoveFromListDialog, setShowRemoveFromListDialog] = React.useState<boolean>(false)

	const toggleRemoveFromListDialog = (isOpen?: boolean) =>
		setShowRemoveFromListDialog(isOpen ?? !showRemoveFromListDialog)

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
								<NewGameCard toggleRemoveFromListDialog={toggleRemoveFromListDialog} classes="mr-2" />
							)
					)}
				</HorizontalScroll>
			) : (
				// TODO: Do something better tbh
				<h1 className="text-center mt-4">No games added to this list yet!</h1>
			)}
			<RemoveFromListDialog isOpen={showRemoveFromListDialog} setIsDialogOpen={toggleRemoveFromListDialog} />
		</div>
	)
}

export default ListOfGames

import React from 'react'
import HorizontalScroll from '../general/HorizontalScroll'
import { GGList, StoredGame } from '@/shared/types'
import NewGameCard from '../Games/NewGameCard'
import RemoveFromListDialog from '../Dialogs/RemoveFromListDialog'
import UpdateGameDialog from '../Dialogs/UpdateGameDialog'
import { useCurrentlySelectedGame } from '../hooks/useStateHooks'
import { useUserListsStore } from '@/state/userListsState'

type ListOfGamesProps = {
	list: GGList
	listName: string
}

// TODO: Only use the horizontal scroll on mobile probably
const ListOfGames = ({ list, listName }: ListOfGamesProps) => {
	const games = useUserListsStore((state) => state.getGamesFromList(listName)) ?? []
	const [showRemoveFromListDialog, setShowRemoveFromListDialog] = React.useState<boolean>(false)
	const [showUpdateGameDialog, setShowUpdateGameDialog] = React.useState<boolean>(false)
	const game = useCurrentlySelectedGame()[0] as StoredGame

	const toggleRemoveFromListDialog = (isOpen?: boolean) =>
		setShowRemoveFromListDialog(isOpen ?? !showRemoveFromListDialog)

	const toggleUpdateGameDialog = (isOpen?: boolean) => setShowUpdateGameDialog(isOpen ?? !showUpdateGameDialog)

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
									listName={listName}
									classes="mr-2"
								/>
							)
					)}
				</HorizontalScroll>
			) : (
				// TODO: Do something better tbh
				<h1 className="text-center mt-4">No games added to this list yet!</h1>
			)}
			{game && (
				<>
					<RemoveFromListDialog isOpen={showRemoveFromListDialog} setIsDialogOpen={toggleRemoveFromListDialog} />
					<UpdateGameDialog isOpen={showUpdateGameDialog} setIsDialogOpen={toggleUpdateGameDialog} />
				</>
			)}
		</div>
	)
}

export default ListOfGames

import React from 'react'
import HorizontalScroll from '../general/HorizontalScroll'
import { GGList, StoredGame } from '@/shared/types'
import GameCard from '../Games/GameCard'
import RemoveFromListDialog from '../Dialogs/RemoveFromListDialog'
import UpdateGameDialog from '../Dialogs/UpdateGameDialog'
import { useCurrentlySelectedGame } from '../hooks/useStateHooks'
import { useUserListsStore } from '@/state/userListsState'
import Link from 'next/link'
import { Button } from '@material-tailwind/react'

type ListOfGamesProps = {
	list: GGList
	listName: string
}

// Garf figure out the bug where you delete a list and then it shits the bed on navigate
// TODO: Only use the horizontal scroll on mobile probably
const ListOfGames = ({ listName }: ListOfGamesProps) => {
	const games = useUserListsStore((state) => state.getGamesFromList(listName)) ?? []
	const [showRemoveFromListDialog, setShowRemoveFromListDialog] = React.useState<boolean>(false)
	const [showUpdateGameDialog, setShowUpdateGameDialog] = React.useState<boolean>(false)
	const game = useCurrentlySelectedGame()[0] as StoredGame

	const toggleRemoveFromListDialog = (isOpen?: boolean) =>
		setShowRemoveFromListDialog(isOpen ?? !showRemoveFromListDialog)

	const toggleUpdateGameDialog = (isOpen?: boolean) => setShowUpdateGameDialog(isOpen ?? !showUpdateGameDialog)

	return (
		<div>
			<Link href={`/app/user/lists/${listName}`}>
				<h3 className="text-3xl text-center hover:text-blue-800 transition-all ease-in-out">{listName}</h3>
			</Link>
			{games.length ? (
				<>
					<HorizontalScroll classes="mb-4">
						{games.map((game: StoredGame, i: number) => {
							if (i <= 10) {
								return (
									// NOTE: This is due to the timestamp coming through in the mapping here. Should fix at a higher level somewhere
									typeof game !== 'string' &&
									game.game_id && (
										<GameCard
											key={`${game.game_id}_${i}`}
											gameFromList={game}
											toggleRemoveFromListDialog={toggleRemoveFromListDialog}
											toggleUpdateGameDialog={toggleUpdateGameDialog}
											listName={listName}
											classes="mr-2"
										/>
									)
								)
							} else {
								return
							}
						})}
					</HorizontalScroll>
					<Link className="text-blue-600 underline hover:text-blue-800" href={`/app/user/lists/${listName}`}>
						<Button size="sm" color="blue">
							View All
						</Button>
					</Link>
				</>
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

import { ListWithOwnership, StoredGame } from '@/shared/types'
import { useGamesStore, GamesState } from '@/state/gamesState'
import { useListsWithOwnershipStore, ListsWithOwnershipState } from '@/state/listsWithOwnershipState'
import { useShallow } from 'zustand/react/shallow'

export const useCurrentlySelectedGame = (): [StoredGame, (game: StoredGame) => any] => {
	const [currentlySelectedGame] = useGamesStore(useShallow((state: GamesState) => [state.currentlySelectedGame]))
	const setCurrentlySelectedGame = useGamesStore(useShallow((state: GamesState) => state.setCurrentlySelectedGame))

	return [currentlySelectedGame!, setCurrentlySelectedGame]
}

export const useListsWithOwnership = (): [
	ListWithOwnership[],
	(newList: ListWithOwnership[]) => any,
	(listName: string, ownershipStatus: boolean) => any
] => {
	const listsWithOwnership = useListsWithOwnershipStore(
		useShallow((state: ListsWithOwnershipState) => state.listsWithOwnership)
	)
	const setListsWithOwnership = useListsWithOwnershipStore(
		useShallow((state: ListsWithOwnershipState) => state.setListsWithOwnership)
	)
	const updateListsWithOwnership = useListsWithOwnershipStore(
		useShallow((state: ListsWithOwnershipState) => state.updateListsWithOwnership)
	)

	return [listsWithOwnership, setListsWithOwnership, updateListsWithOwnership]
}

import { GGList, GGLists, ListWithOwnership, MobyGame, StoredGame } from '@/shared/types'
import { useGamesStore, GamesState } from '@/state/gamesState'
import { useUserListsStore, UserListsState } from '@/state/userListsState'
import { useShallow } from 'zustand/react/shallow'

export const useCurrentlySelectedGame = (): [StoredGame | MobyGame, (game: StoredGame | MobyGame) => any] => {
	const [currentlySelectedGame] = useGamesStore(useShallow((state: GamesState) => [state.currentlySelectedGame]))
	const setCurrentlySelectedGame = useGamesStore(useShallow((state: GamesState) => state.setCurrentlySelectedGame))

	return [currentlySelectedGame!, setCurrentlySelectedGame]
}

export const useUserListsState = (): [GGLists, (newLists: GGLists) => any] => {
	const userLists = useUserListsStore(useShallow((state: UserListsState) => state.lists))
	const setUserLists = useUserListsStore(useShallow((state: UserListsState) => state.setLists))

	return [userLists, setUserLists]
}

// TODO: Find a better way to sort these by name
export const useListsWithOwnership = (): ((game_id: string) => ListWithOwnership[]) =>
	useUserListsStore(useShallow((state: UserListsState) => state.getListsWithOwnership))

export const useCurrentlySelectedList = (): [string, (listName: string) => void] => {
	const currentlySelectedList = useUserListsStore(useShallow((state: UserListsState) => state.currentlySelectedList))
	const setCurrentlySelectedList = useUserListsStore(
		useShallow((state: UserListsState) => state.setCurrentlySelectedList)
	)
	return [currentlySelectedList, setCurrentlySelectedList]
}

export const useAddGameToList = (): ((game: StoredGame, listName: string) => void) =>
	useUserListsStore(useShallow((state: UserListsState) => state.addGameToList))

export const useRemoveGameFromList = (): ((game_id: string, listName: string) => void) =>
	useUserListsStore(useShallow((state: UserListsState) => state.removeGameFromList))

export const useUpdateGameOnList = (): ((game: StoredGame, listName: string) => void) =>
	useUserListsStore(useShallow((state: UserListsState) => state.updateGameOnList))

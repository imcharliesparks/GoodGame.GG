import { MobyGame, StoredGame } from '@/shared/types'
import { create } from 'zustand'
import { useUserListsStore } from './userListsState'

export interface GamesState {
	currentlySelectedGame?: StoredGame | MobyGame
	setCurrentlySelectedGame: (game: StoredGame | MobyGame) => any
	getGamesFromCurrentList: () => StoredGame[]
}

export const useGamesStore = create<GamesState>((set, get) => ({
	currentlySelectedGame: undefined,
	// TODO: Think of a better way to do this. This will only be a MobyGame when on the search page
	setCurrentlySelectedGame: (game: StoredGame | MobyGame) => {
		return set({ currentlySelectedGame: game })
	},
	// TODO: Memoize both of these below
	getGamesFromCurrentList: () => {
		const userListsState = useUserListsStore.getState()
		const currentlySelectedList = userListsState.currentlySelectedList
		const games: StoredGame[] = []
		for (let game_id in userListsState.lists[currentlySelectedList]) {
			games.push(userListsState.lists[currentlySelectedList][game_id])
		}
		return games
	},
	// TODO: Memoize and implement instead of the `hasGame` everywhere
	getUserHasGame: () => {
		const currentlySelectedGame = get().currentlySelectedGame
		const lists = useUserListsStore.getState().lists

		if (!currentlySelectedGame) return false

		for (let listName in lists) {
			if (lists[listName][currentlySelectedGame?.game_id]) {
				return true
			}
		}

		return false
	}
}))

// Set Lists With Ownership
// current list name (could be combined with the above as active list or something)
// Dialog closing and opening?
// Loading?

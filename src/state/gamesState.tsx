import { MobyGame, StoredGame } from '@/shared/types'
import { create } from 'zustand'
import { useUserListsStore } from './userListsState'

export interface GamesState {
	currentlySelectedGame?: StoredGame | MobyGame
	setCurrentlySelectedGame: (game: StoredGame | MobyGame) => any
	getGamesFromCurrentList: () => StoredGame[]
}

export const useGamesStore = create<GamesState>((set) => ({
	currentlySelectedGame: undefined,
	// TODO: Think of a better way to do this. This will only be a MobyGame when on the search page
	setCurrentlySelectedGame: (game: StoredGame | MobyGame) => {
		return set({ currentlySelectedGame: game })
	},
	getGamesFromCurrentList: () => {
		const userListsState = useUserListsStore.getState()
		const currentlySelectedList = userListsState.currentlySelectedList
		const games: StoredGame[] = []
		for (let game_id in userListsState.lists[currentlySelectedList]) {
			games.push(userListsState.lists[currentlySelectedList][game_id])
		}
		return games
	}
}))

// Set Lists With Ownership
// current list name (could be combined with the above as active list or something)
// Dialog closing and opening?
// Loading?

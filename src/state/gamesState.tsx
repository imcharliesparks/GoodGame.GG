import { MobyGame, StoredGame } from '@/shared/types'
import { create } from 'zustand'

export interface GamesState {
	currentlySelectedGame?: StoredGame | MobyGame
	setCurrentlySelectedGame: (game: StoredGame | MobyGame) => any
}

export const useGamesStore = create<GamesState>((set) => ({
	currentlySelectedGame: undefined,
	// TODO: Think of a better way to do this. This will only be a MobyGame when on the search page
	setCurrentlySelectedGame: (game: StoredGame | MobyGame) => {
		return set({ currentlySelectedGame: game })
	}
}))

// Set Lists With Ownership
// current list name (could be combined with the above as active list or something)
// Dialog closing and opening?
// Loading?

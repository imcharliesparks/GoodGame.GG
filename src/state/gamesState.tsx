import { StoredGame } from '@/shared/types'
import { create } from 'zustand'

export interface GamesState {
	currentlySelectedGame?: StoredGame
	setCurrentlySelectedGame: (game: StoredGame) => any
}

export const useGamesStore = create<GamesState>((set) => ({
	currentlySelectedGame: undefined,
	setCurrentlySelectedGame: (game: StoredGame) => {
		return set({ currentlySelectedGame: game })
	}
}))

// Set Lists With Ownership
// current list name (could be combined with the above as active list or something)
// Dialog closing and opening?
// Loading?

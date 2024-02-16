import { ListWithOwnership, StoredGame } from '@/shared/types'
import { create } from 'zustand'

export interface ListsWithOwnershipState {
	listsWithOwnership: ListWithOwnership[]
	setListsWithOwnership: (newList: ListWithOwnership[]) => any
	updateListsWithOwnership: (listName: string, ownershipStatus: boolean) => any
}

export const useGamesStore = create<ListsWithOwnershipState>((set) => ({
	listsWithOwnership: [],
	setListsWithOwnership: (newList: ListWithOwnership[]) => {
		return set({ listsWithOwnership: newList })
	},
	updateListsWithOwnership: (listName: string, ownershipStatus: boolean) => {
		set((state: ListsWithOwnershipState) => {
			const updatedList = state.listsWithOwnership.reduce((prev: ListWithOwnership[], curr: ListWithOwnership) => {
				if (curr.listName === listName) {
					curr.hasGame = ownershipStatus
				}

				return [...prev, curr]
			}, [])

			return { listsWithOwnership: updatedList }
		})
	}
}))

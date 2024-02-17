import { APIMethods, APIStatuses, GGList, GGLists, ListWithOwnership, MobyGame, StoredGame } from '@/shared/types'
import { create } from 'zustand'

export interface UserListsState {
	lists: GGLists
	setLists: (newLists: GGLists) => void
	currentlySelectedList: string
	setCurrentlySelectedList: (listName: string) => void
	getListsWithOwnership: (game_id: string) => ListWithOwnership[]
	addGameToList: (game: StoredGame, listName: string) => void
	removeGameFromList: (game_id: string, listName: string) => void
	// updateListsWithOwnership: (listName: string, ownershipStatus: boolean) => void
}

export const useUserListsStore = create<UserListsState>((set, get) => ({
	lists: {},
	setLists: (newLists: GGLists) => {
		return set({ lists: newLists })
	},
	currentlySelectedList: '',
	setCurrentlySelectedList: (listName: string) => {
		return set({ currentlySelectedList: listName })
	},
	// TODO: Find a way to memo these results
	getListsWithOwnership: (game_id: string) => {
		const currentLists: GGLists = get().lists
		const listsWithOwnership = []
		for (const listName in currentLists) {
			const list = currentLists[listName]

			if (game_id in list) {
				listsWithOwnership.push({
					listName,
					hasGame: true,
					platforms: list[game_id].platforms
				})
			} else {
				listsWithOwnership.push({
					listName,
					hasGame: false,
					platforms: []
				})
			}
		}

		return listsWithOwnership
	},
	addGameToList: async (game: StoredGame, listName: string) => {
		const mutatedLists = get().lists
		mutatedLists[listName][game.game_id] = game

		const request = await fetch(`/api/lists/${listName}/update`, {
			method: APIMethods.PATCH,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(game)
		})
		const response = await request.json()

		if (response.status === APIStatuses.ERROR) {
			console.error(`We couldn't add ${game.title} to your ${listName} list`)
			throw new Error(response.data.error)
		} else {
			set({ lists: mutatedLists })
		}
	},
	removeGameFromList: async (game_id: string, listName: string) => {
		const mutatedLists = get().lists
		delete mutatedLists[listName][game_id]

		const request = await fetch(`/api/lists/${listName}/${game_id}/remove`, {
			method: APIMethods.DELETE,
			headers: {
				'Content-Type': 'application/json'
			}
		})
		const response = await request.json()
		if (response.status === APIStatuses.ERROR) {
			console.error(`We couldn't remove game id #${game_id} from your ${listName} list`)
			throw new Error(response.data.error)
		} else {
			set({ lists: mutatedLists })
		}
	}

	// updateListsWithOwnership: (listName: string, ownershipStatus: boolean) => {
	// 	set((state: UserListsState) => {
	// 		const updatedList = state.listsWithOwnership.reduce((prev: ListWithOwnership[], curr: ListWithOwnership) => {
	// 			if (curr.listName === listName) {
	// 				curr.hasGame = ownershipStatus
	// 			}

	// 			return [...prev, curr]
	// 		}, [])

	// 		return { listsWithOwnership: updatedList }
	// 	})
	// }
}))

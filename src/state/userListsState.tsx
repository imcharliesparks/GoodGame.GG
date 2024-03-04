import { APIMethods, APIStatuses, GGList, GGLists, ListWithOwnership, MobyGame, StoredGame } from '@/shared/types'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import { formatGamesFromList, sortListNames } from '@/shared/utils'
import { create } from 'zustand'

export interface UserListsState {
	lists: GGLists
	setLists: (newLists: GGLists) => void
	fetchAndSetLists: () => void
	currentlySelectedList: string
	setCurrentlySelectedList: (listName: string) => void
	getGamesFromList: (listName: string) => StoredGame[]
	getListsWithOwnership: (game_id: string) => ListWithOwnership[]
	addGameToList: (game: StoredGame, listName: string) => void
	removeGameFromList: (game_id: string, listName: string) => void
	updateGameOnList: (game: StoredGame, listName: string) => void
}

export const useUserListsStore = create<UserListsState>((set, get) => ({
	lists: {},
	setLists: (newLists: GGLists) => {
		return set({ lists: newLists })
	},
	fetchAndSetLists: async () => {
		try {
			const response = await fetch('/api/lists/fetch-all')
			const { data } = await response.json()
			return set({ lists: data })
		} catch (error) {
			// TODO: Add proper error toasting here
			console.error('shit didnt work', error)
		}
	},
	currentlySelectedList: '',
	setCurrentlySelectedList: (listName: string) => {
		return set({ currentlySelectedList: listName })
	},
	getGamesFromList: (listName: string): StoredGame[] => {
		const { lists } = get()
		if (lists[listName]) {
			return formatGamesFromList(lists[listName])
		} else {
			return []
		}
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

		return sortListNames(listsWithOwnership)
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
	},
	updateGameOnList: async (game: StoredGame, listName: string) => {
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
	}
}))

if (process.env.NODE_ENV === 'development') {
	mountStoreDevtool('ListsStore', useUserListsStore)
}

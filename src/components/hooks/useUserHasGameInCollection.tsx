import { GGList, GGLists, ListWithOwnership } from '@/shared/types'

export const useUserHasGameInCollection = (gameId: number, lists: GGLists): ListWithOwnership[] => {
	const formattedGameId = gameId.toString()
	const preferredOrder = ['Collection', 'Backlog', 'Wishlist'] // Define preferred order

	const listsWithGameIdsMap: ListWithOwnership[] = Object.keys(lists)
		.reduce((acc: ListWithOwnership[], curr: string) => {
			const listWithOwnership: ListWithOwnership = {
				listName: curr,
				hasGame: false
			}
			const currentCollection: GGList = lists[curr]
			const currentCollectionsGameIds = new Set<string>(Object.keys(currentCollection))
			if (currentCollectionsGameIds.has(formattedGameId)) {
				listWithOwnership.hasGame = true
			}
			return [...acc, listWithOwnership]
		}, [])
		.sort((a, b) => {
			const indexA = preferredOrder.indexOf(a.listName)
			const indexB = preferredOrder.indexOf(b.listName)

			if (indexA !== -1 && indexB !== -1) {
				// If both keys are in the preferred order, sort them by their order
				return indexA - indexB
			} else if (indexA !== -1) {
				// If only a is in the preferred order, sort a before b
				return -1
			} else if (indexB !== -1) {
				// If only b is in the preferred order, sort b after a
				return 1
			}

			// If neither key is in the preferred order, maintain existing order
			// or you could sort alphabetically or by another criteria here
			return 0
		})

	return listsWithGameIdsMap
}

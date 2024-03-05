import { GGList, GGLists, ListWithOwnership } from '@/shared/types'

export const useUserHasGameInCollection = (gameId: number, lists: GGLists): ListWithOwnership[] => {
	const formattedGameId = gameId.toString()
	const preferredOrder = ['Collection', 'Wishlist', 'Backlog']

	const listsWithGameIdsMap: ListWithOwnership[] = Object.keys(lists)
		.reduce((acc: ListWithOwnership[], curr: string) => {
			const listWithOwnership: ListWithOwnership = {
				listName: curr,
				hasGame: false,
				platforms: []
			}
			const currentCollection: GGList = lists[curr]
			const currentCollectionsGameIds = new Set<string>(Object.keys(currentCollection))
			if (currentCollectionsGameIds.has(formattedGameId)) {
				listWithOwnership.hasGame = true
				listWithOwnership.platforms = currentCollection[formattedGameId].platforms
			}
			return [...acc, listWithOwnership]
		}, [])
		.sort((a, b) => {
			const indexA = preferredOrder.indexOf(a.listName)
			const indexB = preferredOrder.indexOf(b.listName)

			if (indexA !== -1 && indexB !== -1) {
				return indexA - indexB
			} else if (indexA !== -1) {
				return -1
			} else if (indexB !== -1) {
				return 1
			}

			return 0
		})

	return listsWithGameIdsMap
}

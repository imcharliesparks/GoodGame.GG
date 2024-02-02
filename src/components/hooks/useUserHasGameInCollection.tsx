import { GGList, GGLists, ListWithOwnership } from '@/shared/types'

export const useUserHasGameInCollection = (gameId: number, lists: GGLists): ListWithOwnership[] => {
	const formattedGameId = gameId.toString()

	const listsWithGameIdsMap: ListWithOwnership[] = Object.keys(lists).reduce(
		(acc: ListWithOwnership[], curr: string) => {
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
		},
		[]
	)

	return listsWithGameIdsMap
}

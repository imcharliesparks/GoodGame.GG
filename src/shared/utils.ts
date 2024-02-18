import Fuse from 'fuse.js'
import { IGDB_ACCESS_TOKEN, IGDB_BASE_URL } from './constants'
import {
	APIMethods,
	APIStatuses,
	GGList,
	GGUser,
	GamePlayStatus,
	ListWithOwnership,
	MobyGame,
	Platform,
	StoredGame,
	UserByEmail
} from './types'
import { NextRouter } from 'next/router'

/*
 * Data fetching wrapper for the IGDB API
 */
export const igDBFetch = async (endpoint: string, method: APIMethods, queryFields?: string) => {
	const fetchConfig: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json',
			'Client-ID': 'h2zt6fasmm2c3xwip5px3ksbbecpv3',
			Authorization: `Bearer ${IGDB_ACCESS_TOKEN}`
		}
	}

	if (queryFields && method !== APIMethods.GET) {
		fetchConfig.body = queryFields
	}

	const response = await fetch(`${IGDB_BASE_URL}${endpoint}`, { ...fetchConfig })

	if (!response.ok) {
		throw new Error('Network response was not ok')
	}

	return response.json()
}

/*
 * For use shortening description on load for game summaries on the client.
 */
export const truncateDescription = (description: string, maxLength: number) => {
	if (description.length <= maxLength) {
		return description
	}
	return description.slice(0, description.lastIndexOf(' ', maxLength)) + '...'
}

/*
 * For use displaying human-readable dates on the client (non-localed)
 */
export const getReleaseDateFromUTC = (unixDate: number) => new Date(unixDate * 1000).toUTCString()

/*
 * For storing dates in UTC/UNIX on the server
 */
export const getSafeCurrentDate = () => Math.floor(new Date().getTime() / 1000)

/*
 * Finds users by a fuzzy search on their email and returns a string of their IDs
 */
export const handleEmailFuzzySearch = (searchTerm: string, userList: UserByEmail[]): string[] => {
	// TODO: Fine tweak the `threshold` property here to fine tune the algorithm
	const options = {
		includeScore: true,
		keys: ['email']
	}

	const fuse = new Fuse(userList, options)
	const result = fuse.search(searchTerm)
	return result.map((resultItem) => resultItem.item.id)
}

/*
 * Turns a 1-100 percent into a 1-5 score for display as a star rating
 */
export const calculateStarRating = (percentRating: number) => {
	return Math.round(percentRating / 20)
}

/*
 * Generate a unique username with a 4 digit hash
 */
export const generateUsername = (username: string): string => {
	const randomNumbers: number[] = []

	for (let i = 0; i < 4; i++) {
		randomNumbers.push(Math.floor(Math.random() * 9) + 1)
	}

	const hash = randomNumbers.join('')
	return `${username}#${hash}`
}

export const convertMobyScore = (mobyScore: number): number => Number(mobyScore.toString().split('.').join(''))

export const convertFirebaseTimestamps = (list: GGList) => {
	Object.keys(list).forEach((gameId: string) => {
		if (list[gameId] && list[gameId].dateAdded) list[gameId].dateAdded = list[gameId].dateAdded!.toString()
		if (list[gameId] && list[gameId].lastUpdated) list[gameId].lastUpdated = list[gameId].lastUpdated!.toString()
		if (list.dateAdded) list.dateAdded = list.dateAdded.toString()
		if (list.lastUpdated) list.lastUpdated = list.lastUpdated.toString()
	})
}

export const findListsContainingGame = (user: GGUser, game_id: string): string[] => {
	const listsContainingGame: string[] = []

	for (const listName in user.lists) {
		const list = user.lists[listName]

		if (game_id in list) {
			listsContainingGame.push(listName)
		}
	}

	return listsContainingGame
}

export const getListsWithOwnership = (user: GGUser, game_id: string) => {
	const listsContainingGame: ListWithOwnership[] = []
	let userHasGame: boolean = false

	for (const listName in user.lists) {
		const list = user.lists[listName]

		if (game_id in list) {
			listsContainingGame.push({
				listName,
				hasGame: true,
				platforms: list[game_id].platforms
			})
			userHasGame = true
		} else {
			listsContainingGame.push({
				listName,
				hasGame: false,
				platforms: []
			})
		}
	}

	return [userHasGame, listsContainingGame]
}

// TODO: TECH DEBT: Remove manual usages of this logic with this functiion
export const handleUpdateListsWithOwnership = (index: number, ownershipStatus: boolean, setListsWithOwnership: any) => {
	setListsWithOwnership((prev: ListWithOwnership[]) => {
		const updated = Array.from(prev)
		updated[index].hasGame = ownershipStatus
		return updated
	})
}

export const generatePlatformsString = (game: MobyGame | StoredGame): string => {
	return game.platforms.length
		? game.platforms.length > 2
			? 'Multiple Platforms'
			: game.platforms.map((platform: Platform) => platform.platform_name).join(', ')
		: 'No platforms found'
}

export const sortListNames = (lists: ListWithOwnership[]) => {
	const order = ['Collection', 'Backlog', 'Wishlist']

	return lists.sort((a, b) => {
		const indexA = order.indexOf(a.listName)
		const indexB = order.indexOf(b.listName)

		if (indexA !== -1 && indexB !== -1) {
			return indexA - indexB
		} else if (indexA !== -1) {
			return -1
		} else if (indexB !== -1) {
			return 1
		}

		return a.listName.localeCompare(b.listName)
	})
}

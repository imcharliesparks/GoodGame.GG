import { Timestamp } from 'firebase/firestore'
import { IGDB_ACCESS_TOKEN, IGDB_BASE_URL } from './constants'
import { APIMethods } from './types'

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

export const truncateDescription = (description: string, maxLength: number) => {
	if (description.length <= maxLength) {
		return description
	}
	return description.slice(0, description.lastIndexOf(' ', maxLength)) + '...'
}

// For use on the client when displaying
export const getReleaseDateFromUTC = (unixDate: number) => new Date(unixDate * 1000).toUTCString()
// For storing dates in UTC/UNIX on the server
export const getSafeCurrentDate = () => Math.floor(new Date().getTime() / 1000)

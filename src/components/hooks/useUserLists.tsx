import { GGLists } from '@/shared/types'
import React from 'react'

export const useSortedListNames = (lists: GGLists) => {
	const [listNames, setListNames] = React.useState<string[]>([])

	React.useEffect(() => {
		const order = ['Collection', 'Backlog', 'Wishlist']

		const sortedNames = Object.keys(lists).sort((a, b) => {
			const indexA = order.indexOf(a)
			const indexB = order.indexOf(b)

			if (indexA !== -1 && indexB !== -1) {
				return indexA - indexB
			} else if (indexA !== -1) {
				return -1
			} else if (indexB !== -1) {
				return 1
			}

			return a.localeCompare(b)
		})

		setListNames(sortedNames)
	}, [lists])

	return listNames
}

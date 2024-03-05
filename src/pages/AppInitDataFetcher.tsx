import React from 'react'
import { useAuth } from '@clerk/nextjs'
import { useUserListsStore } from '@/state/userListsState'

type FetcherHOCProps = {
	children: React.ReactNode
}

const AppInitDataFetcher = ({ children }: FetcherHOCProps) => {
	const { isLoaded, isSignedIn } = useAuth()
	const fetchAndSetLists = useUserListsStore((state) => state.fetchAndSetLists)
	React.useEffect(() => {
		if (isLoaded && isSignedIn) {
			fetchAndSetLists()
		}
	}, [isLoaded, isSignedIn])

	return <>{children}</>
}

export default AppInitDataFetcher

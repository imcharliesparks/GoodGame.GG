import { useUserListsStore } from '@/state/userListsState'
import { useAuth } from '@clerk/nextjs'
import React from 'react'

const useInitApplication = () => {
	const { isSignedIn } = useAuth()
	const fetchAndSetLists = useUserListsStore((state) => state.fetchAndSetLists)

	React.useEffect(() => {
		if (isSignedIn) {
			fetchAndSetLists()
		}
	}, [isSignedIn])
}

export default useInitApplication

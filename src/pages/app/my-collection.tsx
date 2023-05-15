import CollectionGameCard from '@/components/general/CollectionGameCard'
import Loading from '@/components/general/Loading'
import { APIMethods, APIStatuses, GGGame } from '@/shared/types'
import { useAuth } from '@clerk/nextjs'
import React from 'react'

const MyCollectionPage = () => {
	const { userId } = useAuth()
	const [gamesCollection, setGamesCollection] = React.useState<GGGame[]>()
	const [error, setError] = React.useState<string>()
	const [isLoading, setIsLoading] = React.useState<boolean>(true)

	const fetchCollection = async (userId: string) => {
		try {
			const request = await fetch(`/api/games/my-collection`, {
				method: APIMethods.GET,
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				setGamesCollection(response.data.collection)
			}
		} catch (error) {
			// TODO: Show a "no games added to collection screen here instead"
			console.error(`Could not find a collection for user ${userId}`, error)
			setError(`There was an error fetching your collection!`)
		} finally {
			setIsLoading(false)
		}
	}

	React.useEffect(() => {
		if (userId) {
			fetchCollection(userId)
		}
	}, [userId])

	// TODO: Implement better loading strategies and a better loading animation
	if (isLoading) return <Loading />

	return (
		<div className="max-w-screen flex flex-col items-center py-6">
			<div className="container text-center">
				<h1 className="font-bold text-3xl mb-2">My Collection</h1>
				<div className="container w-full flex flex-col">
					{gamesCollection?.length ? (
						gamesCollection?.map((game) => <CollectionGameCard key={game.gameId} game={game} />)
					) : (
						<h1>You haven't added any games yet!</h1>
					)}
				</div>
			</div>
			{error && (
				<div className="toast toast-center min-w-max">
					<div className="alert alert-error">
						<div>
							<span>{error}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default MyCollectionPage

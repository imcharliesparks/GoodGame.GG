import CollectionGameCard from '@/components/CollectionGameCard'
import { APIMethods, APIStatuses, GGGame } from '@/shared/types'
import { useAuth, useUser } from '@clerk/nextjs'
import React from 'react'

const MyCollectionPage = () => {
	const { userId } = useAuth()
	const [gamesCollection, setGamesCollection] = React.useState<GGGame[]>()
	const [error, setError] = React.useState<string>()
	console.log('gamesCollection', gamesCollection)

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
		}
	}

	React.useEffect(() => {
		if (userId) {
			fetchCollection(userId)
		}
	}, [userId])

	return (
		<div className="max-w-screen flex flex-col items-center py-12">
			<div className="container">
				<h1 className="font-bold text-3xl">My Collection</h1>
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

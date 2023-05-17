import { IGDBGame, GGGame, APIMethods, APIStatuses } from '@/shared/types'
import { truncateDescription } from '@/shared/utils'
import Image from 'next/image'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useRouter } from 'next/router'

type GameCardProps = {
	game: GGGame
	setError: (message: string) => void
}

// TODO: Update these with filler images & skelleton loading
// TODO: Rethink the text center hhere
const GameCard = ({ game, setError }: GameCardProps) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [showFullSummary, setShowFullSummary] = React.useState<boolean>(game.summary.length < 150)
	const coverArt = game.coverArt && game.coverArt.imageUrl ? game.coverArt : null

	const removeFromCollection = async (gameId: number) => {
		setIsLoading(true)
		try {
			const request = await fetch(`/api/wishlist/${gameId}/remove`, {
				method: APIMethods.DELETE,
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				// CS NOTE: This is the pattern for refreshing GSSP data 😬
				router.replace(router.asPath)
			}
		} catch (error) {
			console.error(`Could not delete game with gameId ${gameId}`, error)
			setError(`We couldn't remove that game! Please try again.`)
			setTimeout(() => {
				setError('')
			}, 6000)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="card bg-base-100 shadow-xl text-black mt-4 mx-auto w-fit max-w-[400px]">
			<figure className="pt-8">
				{coverArt ? (
					<Image
						className="rounded-xl max-w-[200px]"
						width={coverArt.width}
						height={coverArt.height}
						src={coverArt.imageUrl}
						alt={`Cover art for ${game.name}`}
					/>
				) : (
					<h1>No image available</h1>
				)}
			</figure>
			<div className="card-body items-center text-center pt-3">
				<h2 className="card-title">{game.name}</h2>
				<p>
					{game.summary ? (showFullSummary ? game.summary : truncateDescription(game.summary, 150)) : 'No summary available'}
				</p>
				<p onClick={() => setShowFullSummary((prev) => !prev)} className="text-left w-[96%] link text-sm text-slate-400">
					{!showFullSummary ? 'More...' : 'Less...'}
				</p>
				<div className="card-actions pt-3">
					<button onClick={() => removeFromCollection(game.gameId)} className="btn btn-primary w-[137px]">
						{isLoading ? <LoadingSpinner /> : '- Wishlist'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default GameCard

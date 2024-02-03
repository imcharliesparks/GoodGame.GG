import { IGDBGame, GGGame, APIMethods, APIStatuses, StoredGame } from '@/shared/types'
import { calculateStarRating, truncateDescription } from '@/shared/utils'
import Image from 'next/image'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useRouter } from 'next/router'
import ReactStars from 'react-stars'

type GameCardProps = {
	game: StoredGame
	setError: (message: string) => void
}

// TODO: Update these with filler images & skelleton loading
const GameCard = ({ game, setError }: GameCardProps) => {
	const router = useRouter()
	// const [showFullSummary, setShowFullSummary] = React.useState<boolean>(game.summary?.length < 150)
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const coverArt = game.sample_cover && game.sample_cover.thumbnail_image ? game.sample_cover : null

	const removeFromCollection = async (gameId: number) => {
		setIsLoading(true)
		try {
			const request = await fetch(`/api/collection/${gameId}/remove`, {
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
		<div className="card bg-base-100 shadow-xl text-black mt-4 mx-4 w-fit max-w-[400px]">
			<figure className="pt-8">
				{coverArt ? (
					<div className="indicator">
						{/* {game.genres?.length && <span className="indicator-item badge badge-primary">{game.genres[0].name}</span>} */}
						<Image
							className="rounded-xl max-w-[150px]"
							width={coverArt.width}
							height={coverArt.height}
							src={coverArt.image}
							alt={`Cover art for ${game.title}`}
						/>
					</div>
				) : (
					<h1>No image available</h1>
				)}
			</figure>
			<div className="card-body items-center text-center pt-3">
				<h2 className="card-title">{game.title}</h2>
				<p>
					{/* {game.description ? (showFullSummary ? game.summary : truncateDescription(game.summary, 150)) : 'No summary available'} */}
				</p>
				{/* {game.summary?.length > 150 && (
					<p onClick={() => setShowFullSummary((prev) => !prev)} className="text-left w-[96%] link text-sm text-slate-400">
						{!showFullSummary ? 'More...' : 'Less...'}
					</p>
				)} */}
				<div className="flex flex-row justify-start w-full">
					<span className="text-sm inline-flex items-center text-slate-600 mr-2">Average Rating: </span>
					{game.moby_score ? (
						<ReactStars count={5} edit={false} value={game.moby_score} size={12} color2={'#ffd700'} />
					) : (
						// TOOD: Tweak this so you have one of the review scores if possible
						<span className="text-sm inline-flex items-center text-black">N/A</span>
					)}
				</div>
				<div className="card-actions pt-3">
					<button onClick={() => removeFromCollection(game.game_id)} className="btn btn-primary w-[137px]">
						{isLoading ? <LoadingSpinner /> : '- Collection'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default GameCard

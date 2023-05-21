import { IGDBGame, GGGame, APIMethods, APIStatuses } from '@/shared/types'
import { calculateStarRating, truncateDescription } from '@/shared/utils'
import Image from 'next/image'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useRouter } from 'next/router'
import ReactStars from 'react-stars'
import HeartIcon from './HeartIcon'

type GameCardProps = {
	game: GGGame
	setError: (message: string) => void
}

// TODO: Link to full game page
const UserPageGameCard = ({ game, setError }: GameCardProps) => {
	const router = useRouter()
	const [showFullSummary, setShowFullSummary] = React.useState<boolean>(game.summary?.length < 150)
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	// const [isHeartClicked, setIsHeartClicked] = React.useState<boolean>(false)
	const coverArt = game.coverArt && game.coverArt.imageUrl ? game.coverArt : null

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
		<div className="card bg-base-100 shadow-xl text-black mt-4 max-w-[300px] w-full flex-shrink-0">
			<figure className="pt-8 relative">
				<HeartIcon />
				{coverArt ? (
					<div className="indicator">
						{game.genres?.length && (
							<span className="indicator-item indicator-center badge badge-primary">{game.genres[0].name}</span>
						)}
						<Image
							className="rounded-xl max-w-[200px]"
							width={coverArt.width}
							height={coverArt.height}
							src={coverArt.imageUrl}
							alt={`Cover art for ${game.name}`}
						/>
					</div>
				) : (
					<h1>No image available</h1>
				)}
			</figure>
			<div className="card-body items-center text-center pt-3">
				<h2 className="card-title">{game.name}</h2>
				{/* <p>
					{game.summary ? (showFullSummary ? game.summary : truncateDescription(game.summary, 150)) : 'No summary available'}
				</p>
				{game.summary?.length > 150 && (
					<p onClick={() => setShowFullSummary((prev) => !prev)} className="text-left w-[96%] link text-sm text-slate-400">
						{!showFullSummary ? 'More...' : 'Less...'}
					</p>
				)} */}
				<div className="flex flex-row justify-start w-full">
					<span className="text-sm inline-flex items-center text-slate-600 mr-2">Average Rating: </span>
					{game.userAndCriticAggregateRating ? (
						<ReactStars
							count={5}
							edit={false}
							value={calculateStarRating(game.userAndCriticAggregateRating)}
							size={12}
							color2={'#ffd700'}
						/>
					) : (
						// TOOD: Tweak this so you have one of the review scores if possible
						<span className="text-sm inline-flex items-center text-black">N/A</span>
					)}
				</div>
				{/* <div className="card-actions pt-3">
					<button onClick={() => removeFromCollection(game.gameId)} className="btn btn-primary w-[137px]">
						{isLoading ? <LoadingSpinner /> : '- Collection'}
					</button>
				</div> */}
			</div>
		</div>
	)
}

export default UserPageGameCard

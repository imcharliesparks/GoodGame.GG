import { GGGame } from '@/shared/types'
import { truncateDescription } from '@/shared/utils'
import Image from 'next/image'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'

type GameCardProps = {
	game: GGGame
	addToCollection: () => void
	addToWishlist: () => void
	isLoading: boolean
}

// TODO: Add placecard//skelleton UI for when there is no cover art
// TODO: Wire up add to wishlist
// TODO: Refactor isLoading so it's per-instance instead of global
const GameCard = ({ game, addToCollection, isLoading }: GameCardProps) => {
	const coverArt = game.coverArt && game.coverArt.imageUrl ? game.coverArt : null
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
				<p>{game.summary ? truncateDescription(game.summary, 120) : 'No summary available'}</p>
				<div className="card-actions pt-3">
					<button onClick={addToCollection} className="btn btn-primary w-[133px]">
						{isLoading ? <LoadingSpinner /> : '+Collection'}
					</button>
					<button className="btn btn-primary w-[133px]">+Wishlist</button>
				</div>
			</div>
		</div>
	)
}

export default GameCard

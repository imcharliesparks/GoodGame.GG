import { IGDBGame, GGGame } from '@/shared/types'
import { truncateDescription } from '@/shared/utils'
import Image from 'next/image'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'

type GameCardProps = {
	game: GGGame
	removeFromCollection: (gameId: number) => void
	isButtonLoading: boolean
}

// TODO: Update these with filler images & skelleton loading
const GameCard = ({ game, removeFromCollection, isButtonLoading }: GameCardProps) => {
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
				{/* <p>{game.summary ? truncateDescription(game.summary, 250) : 'No summary available'}</p> */}
				{/* TODO: reintroduce truncating here but with the ability to view all */}
				<p>{game.summary ? game.summary : 'No summary available'}</p>
				<div className="card-actions pt-3">
					<button onClick={() => removeFromCollection(game.gameId)} className="btn btn-primary w-[137px]">
						{isButtonLoading ? <LoadingSpinner /> : '- Wishlist'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default GameCard

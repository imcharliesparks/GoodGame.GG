import { FullGame } from '@/shared/types'
import { truncateDescription } from '@/shared/utils'
import Image from 'next/image'
import React from 'react'

type GameCardProps = {
	game: FullGame
	addToCollection: () => void
	addToWishlist: () => void
}

const GameCard = ({ game, addToCollection }: GameCardProps) => {
	return (
		<div className="card bg-base-100 shadow-xl text-black mt-4 mx-auto w-fit max-w-[400px]">
			<figure className="pt-8">
				{game.coverArt ? (
					<Image
						className="rounded-xl"
						width={200}
						height={game.coverArt.height}
						src={game.coverArt.url}
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
						+Collection
					</button>
					<button className="btn btn-primary w-[133px]">+Wishlist</button>
				</div>
			</div>
		</div>
	)
}

export default GameCard

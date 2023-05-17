import { GGGame, GamePlayStatus } from '@/shared/types'
import { truncateDescription } from '@/shared/utils'
import Image from 'next/image'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'

type GameCardProps = {
	game: GGGame
	addToCollection: (playStatus: GamePlayStatus) => void
	addToWishlist: (playStatus: GamePlayStatus) => void
	isLoading: boolean
}

// TODO: Add placecard//skelleton UI for when there is no cover art
// TODO: Refactor isLoading so it's per-instance instead of global
// TODO: As part of the intake refactor, prompt users if they already have the game in either collection or wishlist
// TODO: Differentiate the buttons if the user already has an item in collection/wishlist
const SearchGameCard = ({ game, addToCollection, addToWishlist, isLoading }: GameCardProps) => {
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
					<div className="dropdown dropdown-top">
						<label tabIndex={0} className="btn m-1 btn-primary  w-[137px]">
							+ Collection
						</label>
						<ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
							<li>
								<span onClick={() => addToCollection(GamePlayStatus.NOT_PLAYED)}>Want to Play</span>
							</li>
							<li>
								{/* TODO: Prompt an intake where they have an option to leave a review here. Also intake if they've beat it or not */}
								<span onClick={() => addToCollection(GamePlayStatus.PLAYED)}>Already Played</span>
							</li>
						</ul>
					</div>
					<div className="dropdown dropdown-top dropdown-end">
						<label tabIndex={0} className="btn m-1 btn-primary w-[137px]">
							+ Wishlist
						</label>
						<ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
							<li>
								<span onClick={() => addToWishlist(GamePlayStatus.NOT_PLAYED)}>Want to Play</span>
							</li>
							<li>
								<span onClick={() => addToWishlist(GamePlayStatus.PLAYED)}>Already Played</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SearchGameCard

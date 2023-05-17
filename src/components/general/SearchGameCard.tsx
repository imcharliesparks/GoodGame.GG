import { APIMethods, APIStatuses, GGGame, GamePlayStatus } from '@/shared/types'
import { truncateDescription } from '@/shared/utils'
import Image from 'next/image'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'

type GameCardProps = {
	game: GGGame
	handleAddSuccessTest: (message: string) => void
	handleShowError: (message: string) => void
}

// TODO: Add placecard//skelleton UI for when there is no cover art
// TODO: Refactor isLoading so it's per-instance instead of global
// TODO: As part of the intake refactor, prompt users if they already have the game in either collection or wishlist
// TODO: Differentiate the buttons if the user already has an item in collection/wishlist
// TODO: Rethink the dropup pattern because DaisyUI uses active and blur for some reason
// TODO: Fix the no summary cards not taking up the full width
const SearchGameCard = ({ game, handleAddSuccessTest, handleShowError }: GameCardProps) => {
	const coverArt = game.coverArt && game.coverArt.imageUrl ? game.coverArt : null
	const [showFullSummary, setShowFullSummary] = React.useState<boolean>(game.summary?.length < 150)
	const [addToCollectionLoading, setAddToCollectionLoading] = React.useState<boolean>(false)
	const [addToWishlistLoading, setAddToWishlistLoading] = React.useState<boolean>(false)
	const dropdownRef = React.useRef(null)

	const handleDropdownClick = () => {
		const elem = document.activeElement as HTMLLinkElement

		if (elem) {
			elem?.blur()
		}
	}

	const handleAddToCollection = async (game: GGGame) => {
		handleDropdownClick()
		setAddToCollectionLoading(true)
		try {
			const request = await fetch(`/api/collection/add`, {
				method: APIMethods.PATCH,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(game)
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				handleAddSuccessTest('Success! Game added to collection.')
			}
		} catch (error) {
			console.error(`Unable to add game to collection.`, error)
			handleShowError(`Couldn't add that game to your collection! Please try again in a bit.`)
		} finally {
			setAddToCollectionLoading(false)
		}
	}

	const handleAddToWishlist = async (game: GGGame) => {
		handleDropdownClick()
		setAddToWishlistLoading(true)
		try {
			const request = await fetch(`/api/wishlist/add`, {
				method: APIMethods.PATCH,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(game)
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				handleAddSuccessTest('Success! Game added to wishlist.')
			}
		} catch (error) {
			console.error(`Unable to add game to wishlist.`, error)
			handleShowError(`Couldn't add that game to your wishlist! Please try again in a bit.`)
		} finally {
			setAddToWishlistLoading(false)
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
					<div className="dropdown dropdown-top">
						<label tabIndex={0} className="btn m-1 btn-primary  w-[137px]">
							{addToCollectionLoading ? <LoadingSpinner /> : '+ Collection'}
						</label>
						<ul
							tabIndex={0}
							className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 transition-all ease-in-out"
						>
							<li className="transition-all ease-in-out">
								<span onClick={() => handleAddToCollection({ ...game, playStatus: GamePlayStatus.NOT_PLAYED })}>
									Want to Play
								</span>
							</li>
							<li className="transition-all ease-in-out">
								<span onClick={() => handleAddToCollection({ ...game, playStatus: GamePlayStatus.PLAYED })}>
									Already Played
								</span>
							</li>
						</ul>
					</div>
					<div ref={dropdownRef} className="dropdown dropdown-top dropdown-end transition-all ease-in-out">
						<label tabIndex={0} className="btn m-1 btn-primary w-[137px] transition-all ease-in-out">
							{addToWishlistLoading ? <LoadingSpinner /> : '+ Wishlist'}
						</label>
						<ul
							tabIndex={0}
							className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 transition-all ease-in-out"
						>
							<li className="transition-all ease-in-out">
								<span onClick={() => handleAddToWishlist({ ...game, playStatus: GamePlayStatus.NOT_PLAYED })}>
									Want to Play
								</span>
							</li>
							<li className="transition-all ease-in-out">
								<span onClick={() => handleAddToWishlist({ ...game, playStatus: GamePlayStatus.PLAYED })}>Already Played</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SearchGameCard

import { APIMethods, APIStatuses, MobyGame, GamePlayStatus } from '@/shared/types'
import React from 'react'
import Image from 'next/image'
import { truncateDescription, calculateStarRating } from '@/shared/utils'
import ReactStars from 'react-stars'
import LoadingSpinner from './LoadingSpinner'

type NewSearchGameCardProps = {
	game: MobyGame
	handleAddSuccess: (message: string) => void
	handleShowError: (message: string) => void
}

const NewSearchGameCard = ({ game, handleAddSuccess, handleShowError }: NewSearchGameCardProps) => {
	const [showFullDescription, setShowFullDescription] = React.useState<boolean>(game.description?.length < 150)
	const [addToCollectionLoading, setAddToCollectionLoading] = React.useState<boolean>(false)
	const [addToWishlistLoading, setAddToWishlistLoading] = React.useState<boolean>(false)
	const dropdownRef = React.useRef(null)

	const handleDropdownClick = () => {
		const elem = document.activeElement as HTMLLinkElement

		if (elem) {
			elem?.blur()
		}
	}

	const handleAddToCollection = async (game: MobyGame) => {
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
				handleAddSuccess('Success! Game added to collection.')
			}
		} catch (error) {
			console.error(`Unable to add game to collection.`, error)
			handleShowError(`Couldn't add that game to your collection! Please try again in a bit.`)
		} finally {
			setAddToCollectionLoading(false)
		}
	}

	const handleAddToWishlist = async (game: MobyGame) => {
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
				handleAddSuccess('Success! Game added to wishlist.')
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
			{' '}
			<figure className="pt-8">
				<div className="indicator">
					{game.genres?.length && <span className="indicator-item badge badge-primary">{game.genres[0].genre_name}</span>}
					{game.sample_cover && (
						<Image
							className="rounded-xl max-w-[200px]"
							width={game.sample_cover.width}
							height={game.sample_cover.height}
							src={game.sample_cover.thumbnail_image}
							alt={`Cover art for ${game.title}`}
						/>
					)}
				</div>
			</figure>
			<div className="card-body items-center text-center pt-3">
				<h2 className="card-title">{game.title}</h2>
				<p>
					{game.description
						? showFullDescription
							? game.description
							: truncateDescription(game.description, 150)
						: 'No description available'}
				</p>
				{game.description?.length > 150 && (
					<p
						onClick={() => setShowFullDescription((prev) => !prev)}
						className="text-left w-[96%] link text-sm text-slate-400"
					>
						{!showFullDescription ? 'More...' : 'Less...'}
					</p>
				)}
				<div className="flex flex-row justify-start w-full">
					<span className="text-sm inline-flex items-center text-slate-600 mr-2">Average Rating: </span>
					{game.moby_score ? (
						<ReactStars count={5} edit={false} value={calculateStarRating(game.moby_score)} size={12} color2={'#ffd700'} />
					) : (
						// TOOD: Tweak this so you have one of the review scores if possible
						<span className="text-sm inline-flex items-center text-black">N/A</span>
					)}
				</div>
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
								{/* <span onClick={() => handleAddToCollection({ ...game, playStatus: GamePlayStatus.NOT_PLAYED })}> */}
								<span onClick={() => console.log('cheese')}>Want to Play</span>
							</li>
							<li className="transition-all ease-in-out">
								{/* <span onClick={() => handleAddToCollection({ ...game, playStatus: GamePlayStatus.PLAYED })}> */}
								<span onClick={() => console.log('cheese')}>Want to Play Already Played</span>
							</li>
							<li className="transition-all ease-in-out">
								{/* <span onClick={() => handleAddToCollection({ ...game, playStatus: GamePlayStatus.COMPLETED })}> */}
								<span onClick={() => console.log('cheese')}>Want to Play Completed</span>
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
								{/* <span onClick={() => handleAddToWishlist({ ...game, playStatus: GamePlayStatus.NOT_PLAYED })}>
									Want to Play
								</span> */}
								<span onClick={() => console.log('cheese')}>Want to Play</span>
							</li>
							<li className="transition-all ease-in-out">
								{/* <span onClick={() => handleAddToWishlist({ ...game, playStatus: GamePlayStatus.PLAYED })}>Already Played</span> */}
								<span onClick={() => console.log('cheese')}>Already Played</span>d
							</li>
							<li className="transition-all ease-in-out">
								{/* <span onClick={() => handleAddToWishlist({ ...game, playStatus: GamePlayStatus.COMPLETED })}>Completed</span> */}
								<span onClick={() => console.log('cheese')}>Completed</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NewSearchGameCard

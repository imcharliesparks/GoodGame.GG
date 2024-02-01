import { APIMethods, APIStatuses, MobyGame, GamePlayStatus, GamePlatform, Platform } from '@/shared/types'
import React from 'react'
import Image from 'next/image'
import { truncateDescription, calculateStarRating, convertMobyScore } from '@/shared/utils'
import ReactStars from 'react-stars'
import LoadingSpinner from './LoadingSpinner'
import HeartIcon from './HeartIcon'

type NewSearchGameCardProps = {
	game: MobyGame
	lastCard: boolean
	handleOpenModal: () => void
	handleShowSuccessToast: (message: string) => void
	handleShowErrorToast: (message: string) => void
}

const NewSearchGameCard = ({
	game,
	lastCard,
	handleOpenModal,
	handleShowSuccessToast,
	handleShowErrorToast
}: NewSearchGameCardProps) => {
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
				handleShowSuccessToast('Success! Game added to collection.')
			}
		} catch (error) {
			console.error(`Unable to add game to collection.`, error)
			handleShowErrorToast(`Couldn't add that game to your collection! Please try again in a bit.`)
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
				handleShowSuccessToast('Success! Game added to wishlist.')
			}
		} catch (error) {
			console.error(`Unable to add game to wishlist.`, error)
			handleShowErrorToast(`Couldn't add that game to your wishlist! Please try again in a bit.`)
		} finally {
			setAddToWishlistLoading(false)
		}
	}

	const generatePlatformsString = (): string => {
		return game.platforms.length
			? game.platforms.length > 2
				? 'Multiple Platforms'
				: game.platforms.map((platform: Platform) => platform.platform_name).join(', ')
			: 'No platforms found'
	}

	console.log('game', convertMobyScore(game.moby_score))

	return (
		<div className={`border-t-[.25px] border-black w-full min-h-[246px]  ${lastCard && 'border-b-[.25px] border-black'}`}>
			<div className="grid grid-cols-12 min-h-[245px]">
				<div className="col-span-5 bg-gray-200 p-4">
					{/* TODO: Consider placing this here */}
					{/* {game.genres?.length && <span className="indicator-item badge badge-primary">{game.genres[0].genre_name}</span>} */}
					{game.sample_cover && (
						<div className="max-w-[138px]">
							<Image
								className="rounded-xl"
								width={game.sample_cover.width}
								height={game.sample_cover.height}
								src={game.sample_cover.thumbnail_image}
								alt={`Cover art for ${game.title}`}
							/>
						</div>
					)}
				</div>
				<div className="col-span-7 bg-gray-200 p-4">
					<div className="flex flex-col justify-between h-full">
						<div>
							{game.genres?.length && (
								<span className="indicator-item badge badge-primary py-[.75rem]">{game.genres[0].genre_name}</span>
							)}
							<h3 className="text-lg font-bold">{game.title}</h3>
							<p className="text-slate-600 text-sm">{generatePlatformsString()}</p>
							<ReactStars count={5} edit={false} value={Math.round(7.2 / 2)} size={12} />
							<p className="text-left w-[96%] link text-sm text-slate-400">Add modal...</p>
						</div>
						<div>
							<button onClick={handleOpenModal} className="btn btn-block btn-sm text-white">
								+ Add to List
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NewSearchGameCard

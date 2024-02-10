import { APIMethods, APIStatuses, StoredGame } from '@/shared/types'
import Image from 'next/image'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useRouter } from 'next/router'
import ReactStars from 'react-stars'
import RemoveGameFromListModal from '../modal/RemoveGameFromListModal/RemoveGameFromListModal'
import Link from 'next/link'

type ListCardProps = {
	game: StoredGame
	setError: (message: string) => void
	listName: string
}

// TODO: Update these with filler images & skelleton loading
const ListCard = ({ game, setError, listName }: ListCardProps) => {
	const router = useRouter()
	// const [showFullSummary, setShowFullSummary] = React.useState<boolean>(game.summary?.length < 150)
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false)
	const detailsInputRef = React.useRef<HTMLDetailsElement>(null)
	const coverArt = game.sample_cover && game.sample_cover.thumbnail_image ? game.sample_cover : null

	// TODO: Make a better dropdown
	const handleOpenDetailsMenu = () => {
		// @ts-ignore
		if (detailsInputRef.current && (detailsInputRef.current.open == '' || detailsInputRef.current.open === true)) {
			// @ts-ignore
			detailsInputRef.current.open = ''
		} else {
			// @ts-ignore
			detailsInputRef.current.open = null
		}
	}

	const removeFromList = async (game_id: number, listName: string) => {
		setIsLoading(true)
		try {
			const request = await fetch(`/api/lists/${listName}/${game_id}/remove`, {
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
			console.error(`Could not delete game with gameId ${game_id}`, error)
			setError(`We couldn't remove that game! Please try again.`)
			setTimeout(() => {
				setError('')
			}, 6000)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="card bg-base-100 shadow-xl text-black mt-4 mx-3 w-fit max-w-[400px] min-w-[260px] relative">
			<details ref={detailsInputRef} className="dropdown absolute top-2 right-2">
				<summary tabIndex={0} role="button" className="m-1 btn btn-circle btn-sm">
					...
				</summary>
				<ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
					<li onClick={handleOpenDetailsMenu} tabIndex={0}>
						<a>Item 1</a>
					</li>
					<li onClick={handleOpenDetailsMenu}>
						<a>Item 2</a>
					</li>
				</ul>
			</details>
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
				{/* TODO: Add title wrapping and a max width */}
				<h2 className="card-title">{game.title}</h2>
				<p className="text-slate-600 text-sm"></p>
				<p>
					{/* {game.description ? (showFullSummary ? game.summary : truncateDescription(game.summary, 150)) : 'No summary available'} */}
				</p>
				{/* {game.summary?.length > 150 && (
					<p onClick={() => setShowFullSummary((prev) => !prev)} className="text-left w-[96%] link text-sm text-slate-400">
						{!showFullSummary ? 'More...' : 'Less...'}
					</p>
				)} */}
				<div className="flex flex-row justify-start w-full">
					{/* <span className="text-sm inline-flex items-center text-slate-600 mr-2">Average Rating: </span>
					{game.moby_score ? (
						<ReactStars count={5} edit={false} value={game.moby_score} size={12} color2={'#ffd700'} />
					) : (
						// TOOD: Tweak this so you have one of the review scores if possible
					<span className="text-sm inline-flex items-center text-black">N/A</span>
					)} */}
				</div>
				<div className="card-actions pt-3">
					<Link href={`/app/games/${game.game_id}/details`} className="btn btn-primary btn-sm">
						Details
					</Link>
					<button onClick={() => setIsDeleteModalOpen(true)} className="btn btn-outline btn-error btn-sm">
						Remove
					</button>
				</div>
			</div>
			{isDeleteModalOpen && (
				<RemoveGameFromListModal
					removeGame={() => removeFromList(game.game_id, listName)}
					game={game}
					listName={listName}
					isModalOpen={isDeleteModalOpen}
					closeModal={() => setIsDeleteModalOpen(false)}
					isDeleteButtonLoading={isLoading}
				/>
			)}
		</div>
	)
}

export default ListCard

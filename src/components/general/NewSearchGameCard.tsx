import { APIMethods, APIStatuses, MobyGame, GamePlayStatus, GamePlatform, Platform } from '@/shared/types'
import React from 'react'
import Image from 'next/image'
import { truncateDescription, calculateStarRating, convertMobyScore, generatePlatformsString } from '@/shared/utils'
import ReactStars from 'react-stars'
import LoadingSpinner from './LoadingSpinner'
import HeartIcon from './HeartIcon'
import { Button } from '@material-tailwind/react'
import { useRouter } from 'next/router'

type NewSearchGameCardProps = {
	game: MobyGame
	lastCard: boolean
	handleOpenDrawer: () => void
}

const NewSearchGameCard = ({ game, lastCard, handleOpenDrawer }: NewSearchGameCardProps) => {
	const router = useRouter()

	// TODO: Handle when title and platform list are hella long
	return (
		<div className={`border-t-[.25px] border-black w-full min-h-[245px]  ${lastCard && 'border-b-[.25px] border-black'}`}>
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
							<p className="text-slate-600 text-sm">{generatePlatformsString(game)}</p>
							{game.moby_score && <ReactStars count={5} edit={false} value={Math.round(7.2 / 2)} size={12} />}
						</div>
						<div>
							<Button
								onClick={() => router.push(`/app/games/game-details/${game.game_id}`)}
								fullWidth
								color="blue"
								className="flex items-center justify-center gap-3 btn-sm mb-2"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="h-5 w-5"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
								</svg>
								<span className="tracking-wide font-normal">More Details</span>
							</Button>
							<Button
								onClick={handleOpenDrawer}
								fullWidth
								color="green"
								className="flex items-center justify-center gap-3 btn-sm"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="h-5 w-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
									/>
								</svg>
								<span className="tracking-wide font-normal">Add to List</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NewSearchGameCard

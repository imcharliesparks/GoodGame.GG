import React from 'react'
import Image from 'next/image'
import { MobyGame } from '@/shared/types'
import { truncateDescription } from '@/shared/utils'
import { Button } from '@material-tailwind/react'

type GameDetailsMobileTopProps = {
	game: MobyGame
	platformList: string
	hasGame: boolean
	openDrawerBottom: () => void
}

// TODO: Add some sort of marker to indicate that the game is on a list
const GameDetailsMobileTop = ({ game, platformList, hasGame, openDrawerBottom }: GameDetailsMobileTopProps) => {
	const [showFullDescription, setShowFullDescription] = React.useState<boolean>(false)

	return (
		<div className="flex flex-col gap-2 items-center pt-8 pb-24">
			<div>
				{' '}
				<Image
					alt={`Box art for ${game.title}`}
					src={game.sample_cover.thumbnail_image}
					width={game.sample_cover.width}
					height={game.sample_cover.height}
					className="max-w-[250px]"
				/>
			</div>
			<div className="mx-auto mt-4">
				<h1
					style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'break-spaces' }}
					className="text-3xl text-center mb-1"
				>
					{game.title}
				</h1>
			</div>
			<div className="mx-auto mb-1 px-2">
				<p className="text-gray-700 text-center">{platformList}</p>
			</div>
			{/* TODO: Consider adding stars from material tailwind here for ratings */}
			{/* <div className="flex flex-row justify-center w-full -mt-3">
				<ReactStars count={5} edit={false} value={game.moby_score ?? 0} size={36} color2={'#ffd700'} />
			</div> */}
			<div className="mb-2 w-full max-w-[250px]">
				<Button onClick={openDrawerBottom} fullWidth color="green" className="flex items-center justify-center gap-3">
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
			{game.description ? (
				<div className="mx-auto max-w-[275px]">
					<section>
						{showFullDescription ? (
							<>
								<p>{game.description}</p>
								<button
									onClick={() => setShowFullDescription(false)}
									className="text-left w-[96%] link text-sm text-slate-400 mt-2"
								>
									Less...
								</button>
							</>
						) : (
							<>
								<p>{truncateDescription(game.description, 200)}</p>
								<button
									onClick={() => setShowFullDescription(true)}
									className="text-left w-[96%] link text-sm text-slate-400 mt-2"
								>
									More...
								</button>
							</>
						)}
					</section>
				</div>
			) : (
				<p>No description available</p>
			)}
		</div>
	)
}

export default GameDetailsMobileTop

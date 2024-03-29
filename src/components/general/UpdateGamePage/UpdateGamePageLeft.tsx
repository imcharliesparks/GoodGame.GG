import { MobyGame } from '@/shared/types'
import { Button } from '@material-tailwind/react'
import Image from 'next/image'
import React from 'react'

type UpdateGamePageLeftProps = {
	game: MobyGame
	hasGame: boolean
	openDrawerBottom: () => void
}

// TODO: Add some sort of indicator if game is on the list
const UpdateGamePageLeft = ({ game, hasGame, openDrawerBottom }: UpdateGamePageLeftProps) => {
	return (
		<div className="flex flex-col md:mr-2 mr-0">
			<div>
				{' '}
				<Image
					alt={`Box art for ${game.title}`}
					src={game.sample_cover.thumbnail_image}
					width={game.sample_cover.width}
					height={game.sample_cover.height}
				/>
			</div>
			<div className="mt-6 mb-2">
				{/* TODO: Convert to icon button */}
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
					<span className="tracking-wide font-normal">Update Lists</span>
				</Button>
			</div>
		</div>
	)
}

export default UpdateGamePageLeft

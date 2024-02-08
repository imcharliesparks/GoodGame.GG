import { MobyGame, StoredGame } from '@/shared/types'
import { convertMobyScore } from '@/shared/utils'
import { Button } from '@material-tailwind/react'
import Image from 'next/image'
import React from 'react'
import ReactStars from 'react-stars'

type GameDetailsPageLeftProps = {
	game: MobyGame
	hasGame: boolean
	openDrawerBottom: () => void
}

// TODO: Add some sort of indicator if game is on the list
const GameDetailsPageLeft = ({ game, hasGame, openDrawerBottom }: GameDetailsPageLeftProps) => {
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
				<Button fullWidth onClick={openDrawerBottom}>
					+ Add to List
				</Button>
			</div>
			<div className="flex flex-row justify-center w-full">
				<ReactStars count={5} edit={false} value={game.moby_score ?? 0} size={36} color2={'#ffd700'} />
			</div>
		</div>
	)
}

export default GameDetailsPageLeft

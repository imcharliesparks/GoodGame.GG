import { StoredGame } from '@/shared/types'
import { convertMobyScore } from '@/shared/utils'
import Image from 'next/image'
import React from 'react'
import ReactStars from 'react-stars'

type GameDetailsPageLeftProps = {
	game: StoredGame
	hasGame: boolean
}

const GameDetailsPageLeft = ({ game }: GameDetailsPageLeftProps) => {
	console.log('game', game)
	return (
		<div className="flex flex-col">
			<div>
				<Image
					alt={`Box art for ${game.title}`}
					src={game.sample_cover.thumbnail_image}
					width={game.sample_cover.width}
					height={game.sample_cover.height}
				/>
			</div>
			<div>
				<button>Add to List</button>
			</div>
			<div>
				<ReactStars
					count={5}
					edit={false}
					value={game.moby_score ? convertMobyScore(game.moby_score) : 0}
					size={12}
					color2={'#ffd700'}
				/>
			</div>
		</div>
	)
}

export default GameDetailsPageLeft

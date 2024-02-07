import { MobyGame, StoredGame } from '@/shared/types'
import { convertMobyScore } from '@/shared/utils'
import Image from 'next/image'
import React from 'react'
import ReactStars from 'react-stars'

type GameDetailsPageLeftProps = {
	game: MobyGame
	hasGame: boolean
	isModalOpen: boolean
	setIsModalOpen: (isOpen: boolean) => void
}

const GameDetailsPageLeft = ({ game, hasGame, isModalOpen, setIsModalOpen }: GameDetailsPageLeftProps) => {
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
				<button onClick={() => setIsModalOpen(true)} className="btn btn-block btn-sm btn-primary text-white">
					+ Add to List
				</button>
			</div>
			<div className="flex flex-row justify-center w-full">
				<ReactStars count={5} edit={false} value={game.moby_score ?? 0} size={36} color2={'#ffd700'} />
			</div>
		</div>
	)
}

export default GameDetailsPageLeft

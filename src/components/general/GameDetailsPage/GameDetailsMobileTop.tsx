import React from 'react'
import Image from 'next/image'
import { MobyGame } from '@/shared/types'

type GameDetailsMobileTopProps = {
	game: MobyGame
	hasGame: boolean
	platformList: string
	isModalOpen: boolean
	listsWithGame: string[]
	setIsModalOpen: (isOpen: boolean) => void
}

const GameDetailsMobileTop = ({
	game,
	hasGame,
	platformList,
	isModalOpen,
	listsWithGame,
	setIsModalOpen
}: GameDetailsMobileTopProps) => {
	return (
		<div className="flex flex-col gap-4 items-center py-8">
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
			<div>
				<div className="mx-auto ">
					<h1
						style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'break-spaces' }}
						className="text-3xl text-center"
					>
						{game.title}
					</h1>
					<span className="text-slate-500 font-bold">{platformList}</span>
				</div>
			</div>
		</div>
	)
}

export default GameDetailsMobileTop

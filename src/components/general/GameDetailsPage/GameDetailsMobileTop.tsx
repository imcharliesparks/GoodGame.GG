import React from 'react'
import Image from 'next/image'
import { MobyGame } from '@/shared/types'
import ReactStars from 'react-stars'
import { truncateDescription } from '@/shared/utils'

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
				<span className="text-slate-500 font-bold">{platformList}</span>
			</div>
			<div className="flex flex-row justify-center w-full -mt-3">
				<ReactStars count={5} edit={false} value={game.moby_score ?? 0} size={36} color2={'#ffd700'} />
			</div>
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
		</div>
	)
}

export default GameDetailsMobileTop

import { MobyGame, Platform, StoredGame } from '@/shared/types'
import { convertMobyScore, truncateDescription } from '@/shared/utils'
import Image from 'next/image'
import React from 'react'
import ReactStars from 'react-stars'

type GameDetailsPageRightProps = {
	game: MobyGame
	hasGame: boolean
	isModalOpen: boolean
	setIsModalOpen: (isOpen: boolean) => void
}

const GameDetailsPageRight = ({ game, hasGame, isModalOpen, setIsModalOpen }: GameDetailsPageRightProps) => {
	const [showFullDescription, setShowFullDescription] = React.useState<boolean>(false)
	const platformList = game.platforms.reduce((platforms: string, platform: Platform, index: number) => {
		return index === 0 ? `${platform.platform_name} | ` : `${platforms} ${platform.platform_name}`
	}, '')
	return (
		<div className="flex flex-col mx-auto md:ml-2 ml-0">
			<div className="mx-auto ">
				<h1
					style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'break-spaces' }}
					className="text-3xl text center"
				>
					{game.title}
				</h1>
			</div>
			<div className="mx-auto">
				<span className="text-slate-500 font-bold">{platformList}</span>
			</div>
			<div className="mx-auto max-w-[470px]">
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
							<p>{truncateDescription(game.description, 400)}</p>
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
			{/* <div>t
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
			</div> */}
		</div>
	)
}

export default GameDetailsPageRight

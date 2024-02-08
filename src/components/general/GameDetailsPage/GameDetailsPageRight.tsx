import { MobyGame, Platform, StoredGame } from '@/shared/types'
import { convertMobyScore, truncateDescription } from '@/shared/utils'
import Image from 'next/image'
import React from 'react'
import ReactStars from 'react-stars'

type GameDetailsPageRightProps = {
	game: MobyGame
	hasGame: boolean
	platformList: string
}

// TODO: Add indicator for has game here
const GameDetailsPageRight = ({ game, hasGame, platformList }: GameDetailsPageRightProps) => {
	const [showFullDescription, setShowFullDescription] = React.useState<boolean>(false)

	return (
		<div className="flex flex-col mx-auto md:ml-2 ml-0">
			<div className="mx-auto ">
				<h1
					style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'break-spaces' }}
					className="text-3xl text-center"
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
		</div>
	)
}

export default GameDetailsPageRight

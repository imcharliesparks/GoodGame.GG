import { MobyGame } from '@/shared/types'
import { truncateDescription } from '@/shared/utils'
import React from 'react'

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
			<div className="mx-auto my-2">
				<p className="text-gray-700 text-center">{platformList}</p>
			</div>
			<div className="mx-auto max-w-[470px]">
				{game.description ? (
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
				) : (
					<p className="mt-4">No description available</p>
				)}
			</div>
		</div>
	)
}

export default GameDetailsPageRight

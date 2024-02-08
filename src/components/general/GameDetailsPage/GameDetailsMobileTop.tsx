import React from 'react'
import Image from 'next/image'
import { GamePlayStatus, ListWithOwnership, MobyGame, Platform } from '@/shared/types'
import ReactStars from 'react-stars'
import { truncateDescription } from '@/shared/utils'
import { Drawer, Button } from '@material-tailwind/react'
import BaseBottomDrawer from '@/components/Drawers/BottomDrawer/BaseBottomDrawer'
import GameDetailsBottomDrawer from '@/components/Drawers/BottomDrawer/GameDetailsBottomDrawer'

type GameDetailsMobileTopProps = {
	game: MobyGame
	hasGame: boolean
	platformList: string
	isModalOpen: boolean
	listsWithOwnership: ListWithOwnership[]
	setIsModalOpen: (isOpen: boolean) => void
	handleAddGameToList: (
		game: MobyGame,
		listName: string,
		index: number,
		playStatus: Record<any, any>,
		platform: Platform[]
	) => Promise<boolean>
	handleDeleteGameFromList: (listName: string, index: number) => Promise<boolean>
}

const GameDetailsMobileTop = ({
	game,
	hasGame,
	platformList,
	isModalOpen,
	listsWithOwnership,
	setIsModalOpen,
	handleAddGameToList,
	handleDeleteGameFromList
}: GameDetailsMobileTopProps) => {
	const [showFullDescription, setShowFullDescription] = React.useState<boolean>(false)
	const [openBottom, setOpenBottom] = React.useState(false)

	console.log('handleDeleteGameFromList', handleDeleteGameFromList)

	const openDrawerBottom = () => setOpenBottom(true)
	const closeDrawerBottom = () => setOpenBottom(false)

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
			<div className="mb-2 w-full max-w-[250px]">
				<button onClick={openDrawerBottom} className="btn btn-block btn-sm btn-primary text-white">
					+ Add to List
				</button>
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
			<GameDetailsBottomDrawer
				game={game}
				open={openBottom}
				close={closeDrawerBottom}
				lists={listsWithOwnership}
				handleAddGameToList={handleAddGameToList}
				handleDeleteGameFromList={handleDeleteGameFromList}
			/>
		</div>
	)
}

export default GameDetailsMobileTop

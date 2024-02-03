import { StoredGame } from '@/shared/types'
import React from 'react'
import Image from 'next/image'
import ReactStars from 'react-stars'

type ListCardProps = {
	lastCard?: boolean
	game: StoredGame
}

const ListCard = ({ game }: ListCardProps) => {
	return (
		// <div className={`border-t-[.25px] border-black w-full min-h-[246px]  ${lastCard && 'border-b-[.25px] border-black'}`}>
		<div className={`border-t-[.25px] border-black w-full min-h-[246px] `}>
			<div className="grid grid-cols-12 min-h-[245px]">
				<div className="col-span-5 bg-gray-200 p-4">
					{/* TODO: Consider placing this here */}
					{/* {game.genres?.length && <span className="indicator-item badge badge-primary">{game.genres[0].genre_name}</span>} */}
					{game.sample_cover && (
						<div className="max-w-[138px]">
							<Image
								className="rounded-xl"
								width={game.sample_cover.width}
								height={game.sample_cover.height}
								src={game.sample_cover.thumbnail_image}
								alt={`Cover art for ${game.title}`}
							/>
						</div>
					)}
				</div>
				<div className="col-span-7 bg-gray-200 p-4">
					<div className="flex flex-col justify-between h-full">
						<div>
							{/* {game.genres?.length && (
								<span className="indicator-item badge badge-primary py-[.75rem]">{game.genres[0].genre_name}</span>
							)} */}
							<h3 className="text-lg font-bold">{game.title}</h3>
							{/* <p className="text-slate-600 text-sm">{generatePlatformsString()}</p> */}
							{game.moby_score && <ReactStars count={5} edit={false} value={Math.round(7.2 / 2)} size={12} />}

							<p className="text-left w-[96%] link text-sm text-slate-400">Add modal...</p>
						</div>
						<div>
							<button onClick={() => console.log('cheese')} className="btn btn-block btn-sm text-white">
								+ Add to List
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ListCard
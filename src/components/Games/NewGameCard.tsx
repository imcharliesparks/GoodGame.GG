import * as React from 'react'
import { Card, CardHeader, CardBody, Typography, Avatar, Button, Badge, IconButton } from '@material-tailwind/react'
import { APIMethods, APIStatuses, MobyGame, StoredGame } from '@/shared/types'
import { generatePlatformsString } from '@/shared/utils'
import { useRouter } from 'next/router'
import GameCardIconMenu from './GameCardIconMenu'

type NewGameCardProps = {
	game: StoredGame
	listName: string
	toggleRemoveFromListDialog: (isOpen?: boolean) => void
	setCurrentlySelectedGame: (game: StoredGame) => void
}

export const NewGameCard = ({
	game,
	listName,
	toggleRemoveFromListDialog,
	setCurrentlySelectedGame
}: NewGameCardProps) => {
	const currentHeight = 640
	const currentWidth = 443.5
	const newHeight = 300
	const newWidth = (currentWidth / currentHeight) * newHeight
	const platformString = generatePlatformsString(game)

	const setGameAndOpenDialog = () => {
		setCurrentlySelectedGame(game)
		toggleRemoveFromListDialog(true)
	}

	return (
		<Card
			shadow={false}
			style={{
				width: newWidth,
				height: newHeight
			}}
			className="relative grid items-end justify-center text-center mr-2 min-w-[208px]"
		>
			<GameCardIconMenu game={game} openRemoveFromListDialog={setGameAndOpenDialog} />
			<CardHeader
				floated={false}
				shadow={false}
				color="transparent"
				style={{
					backgroundImage: `url(${game.sample_cover.image})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center'
				}}
				className={`absolute inset-0 m-0 h-full w-full rounded-none`}
			>
				<div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/50" />
			</CardHeader>
			<CardBody className="relative flex flex-col justify-end">
				<Typography
					style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'break-spaces' }}
					variant="paragraph"
					color="white"
					className="font-medium leading-[1.5]"
				>
					{game.title}
				</Typography>
				<Typography
					style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'break-spaces' }}
					variant="small"
					className="text-gray-600"
				>
					{platformString.length ? platformString : 'N/A'}
				</Typography>
			</CardBody>
		</Card>
	)
}

export default NewGameCard

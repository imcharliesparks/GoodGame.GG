import * as React from 'react'
import { Card, CardHeader, CardBody, Typography, Avatar, Button, Badge, IconButton } from '@material-tailwind/react'
import { APIMethods, APIStatuses, MobyGame, StoredGame } from '@/shared/types'
import { generatePlatformsString } from '@/shared/utils'
import { useRouter } from 'next/router'
import GameCardIconMenu from './GameCardIconMenu'
import Link from 'next/link'
import Icon from 'react-icons-kit'
import { useCurrentlySelectedGame } from '../hooks/useStateHooks'

type NewGameCardProps = {
	toggleRemoveFromListDialog: (isOpen?: boolean) => void
	classes?: string
}

export const NewGameCard = ({ toggleRemoveFromListDialog, classes }: NewGameCardProps) => {
	const router = useRouter()
	const [currentlySelectedGame, setCurrentlySelectedGame] = useCurrentlySelectedGame()
	const currentHeight = 640
	const currentWidth = 443.5
	const newHeight = 300
	const newWidth = (currentWidth / currentHeight) * newHeight
	const platformString = generatePlatformsString(currentlySelectedGame)

	const setGameAndOpenDeleteDialog = () => {
		setCurrentlySelectedGame(currentlySelectedGame)
		toggleRemoveFromListDialog(true)
	}

	const setGameAndOpenUpdateDialog = () => {
		setCurrentlySelectedGame(currentlySelectedGame)
		toggleRemoveFromListDialog(true)
	}

	return (
		<Card
			shadow={false}
			style={{
				width: newWidth,
				height: newHeight
			}}
			className={`${classes ? classes : ''} relative grid items-end justify-center text-center min-w-[208px] group`}
		>
			<GameCardIconMenu
				game={currentlySelectedGame}
				openRemoveFromListDialog={setGameAndOpenDeleteDialog}
				setGameAndOpenUpdateDialog={setGameAndOpenUpdateDialog}
			/>
			<CardHeader
				floated={false}
				shadow={false}
				color="transparent"
				style={{
					backgroundImage: `url(${currentlySelectedGame.sample_cover.image})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center'
				}}
				className={`absolute inset-0 m-0 h-full w-full rounded-none`}
			>
				<div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-black/70 via-black/50" />
				{/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black h-52 w-52 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"></div> */}

				<ul className="list-none absolute right-0 left-0 -bottom-20 group-hover:bottom-5 transition-all duration-500 ease-in-out z-3">
					<li className="inline mx-1">
						<Button onClick={() => router.replace(`/app/games/${currentlySelectedGame.game_id}/details`)} variant="gradient">
							Details
						</Button>
					</li>
				</ul>
			</CardHeader>
			<CardBody className="relative flex flex-col justify-end">
				<Typography
					style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'break-spaces' }}
					variant="paragraph"
					color="white"
					className="font-medium leading-[1.5]"
				>
					{currentlySelectedGame.title}
				</Typography>
				<Typography
					style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'break-spaces' }}
					variant="small"
					className="text-gray-500"
				>
					{platformString.length ? platformString : 'N/A'}
				</Typography>
			</CardBody>
		</Card>
	)
}

export default NewGameCard

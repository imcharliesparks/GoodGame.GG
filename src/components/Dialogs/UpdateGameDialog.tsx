// @ts-nocheck
import { GamePlayStatus, ListWithOwnership, MobyGame, Platform, StoredGame } from '@/shared/types'
import { Dialog } from '@material-tailwind/react'
import React from 'react'
import Icon from 'react-icons-kit'
import Select from 'react-tailwindcss-select'
import { ic_close } from 'react-icons-kit/md/ic_close'
import styles from '../../styles/components/AddToListDialog.module.css'
import { handleAddGameToList } from '@/shared/utils'
import { useRouter } from 'next/router'
import { Button } from '@material-tailwind/react'

type UpdateGameDialogProps = {
	isOpen: boolean
	setIsDialogOpen: () => void
}

type PlatformLabelOptions = {
	label: string
	disabled?: boolean
	value: number
	platformData: Platform
}

const UpdateGameDialog = ({ setIsDialogOpen, isOpen }: UpdateGameDialogProps) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [selectedPlatforms, setSelectedPlatforms] = React.useState<PlatformLabelOptions[]>([])
	const [platformOptions, setPlatformOptions] = React.useState<Record<any, any>>([])
	const [selectedGameplayStatus, setSelectedGameplayStatus] = React.useState<GamePlayStatus>()
	const [selectedGameplayStatus, setSelectedGameplayStatus] = React.useState<GamePlayStatus>()
	const [game] = useCurrentlySelectedGame()
	const [_1, _2, addGameToList] = useUserListsState()
	const [listName] = useCurrentlySelectedList()

	const gameplayStatusOptions = [
		{
			label: GamePlayStatus.NOT_PLAYED,
			value: GamePlayStatus.NOT_PLAYED
		},
		{
			label: GamePlayStatus.PLAYED,
			value: GamePlayStatus.PLAYED
		},
		{
			label: GamePlayStatus.COMPLETED,
			value: GamePlayStatus.COMPLETED
		}
	]

	React.useEffect(() => {
		const mappedPlatformOptions = game.platforms.map((platform: Platform) => ({
			platformData: platform,
			value: platform.platform_id,
			label: platform.platform_name
		}))
		setPlatformOptions(mappedPlatformOptions)
		const mappedPlatformResults = storedGame!.platforms.map((platform: Platform) => ({
			platformData: platform,
			value: platform.platform_id,
			label: platform.platform_name
		}))
		setSelectedPlatforms(mappedPlatformResults)
	}, [storedGame.platforms])

	React.useEffect(() => {
		if (storedGame.playStatus) {
			const foundGameplayStatus = gameplayStatusOptions.find((playStatus) => playStatus.value === storedGame.playStatus)
			setSelectedGameplayStatus(foundGameplayStatus)
		}
	}, [storedGame.playStatus])

	const handlePlatformChange = (value: PlatformLabelOptions) => {
		setSelectedPlatforms(value)
	}

	const handleGameplayStatusChange = (value: Record<string, any>) => {
		setSelectedGameplayStatus(value)
	}

	const handleTeardown = (e: any) => {
		setSelectedPlatforms([])
		setPlatformOptions([])
		setSelectedGameplayStatus()
		setIsDialogOpen(e)
	}

	const addGameToList = async () => {
		setIsLoading(true)
		const finalPlatforms = selectedPlatforms.reduce((prev: Platform[], curr: PlatformLabelOptions) => {
			const platform: Platform = {
				...curr.platformData
			}

			return [...prev, platform]
		}, [])

		const gamePayload = {
			...storedGame,
			platforms: finalPlatforms
		}
		const result = await handleAddGameToList(
			gamePayload,
			listName,
			index,
			selectedGameplayStatus ?? undefined,
			router,
			setListsWithOwnership,
			true
		)

		setIsLoading(false)

		if (result) {
			handleTeardown()
			setIsDialogOpen(false)
		}
	}

	return (
		<Dialog id={styles.addToListDialog} size="xs" open={isOpen} handler={handleTeardown} className="h-[300px]">
			<div className="h-full relative h-xl">
				<div className="grid grid-cols-2 border-b-2 pb-2 mb-2">
					<h4 className="text-left">Update Game on List</h4>
					<div autoFocus onClick={setIsDialogOpen} className="cursor-pointer text-right">
						<Icon icon={ic_close} size={24} />
					</div>
				</div>
				<div className="mb-3">
					<h4 className="text-md mb-2">What platform(s)?</h4>
					<Select
						isMultiple
						primaryColor="white"
						value={selectedPlatforms}
						onChange={handlePlatformChange}
						options={platformOptions}
					/>
				</div>
				<div className="mb-3">
					<h4 className="text-md mb-2">Have you already played it?</h4>
					<Select
						primaryColor="white"
						value={selectedGameplayStatus}
						onChange={handleGameplayStatusChange}
						options={gameplayStatusOptions}
					/>
				</div>
				<div className="absolute bottom-3 w-full">
					<Button
						loading={isLoading}
						onClick={addGameToList}
						fullWidth
						color="green"
						className="flex items-center justify-center gap-3 btn-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="h-5 w-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
							/>
						</svg>
						<span className="tracking-wide font-normal">Update</span>
					</Button>
				</div>
			</div>
		</Dialog>
	)
}

export default UpdateGameDialog

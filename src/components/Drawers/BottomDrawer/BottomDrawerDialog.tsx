// @ts-nocheck
import { GamePlayStatus, MobyGame, Platform } from '@/shared/types'
import { Dialog } from '@material-tailwind/react'
import React from 'react'
import Icon from 'react-icons-kit'
import Select from 'react-tailwindcss-select'
import { ic_close } from 'react-icons-kit/md/ic_close'

type BottomDrawerDialogProps = {
	handleAddGameToList: (
		game: MobyGame,
		listName: string,
		index: number,
		playStatus: Record<any, any>,
		platforms: Platform[]
	) => Promise<boolean>
	isOpen: boolean
	setIsDialogOpen: () => void
	listName: string
	index: number
	game: MobyGame
}

type PlatformLabelOptions = {
	label: string
	disabled?: boolean
	value: number
	platformData: Platform
}

const BottomDrawerDialog = ({
	game,
	handleAddGameToList,
	setIsDialogOpen,
	listName,
	index,
	isOpen
}: BottomDrawerDialogProps) => {
	const [selectedPlatforms, setSelectedPlatforms] = React.useState<PlatformLabelOptions[]>([])
	const [platformOptions, setPlatformOptions] = React.useState<Record<any, any>>([])
	const [selectedGameplayStatus, setSelectedGameplayStatus] = React.useState<GamePlayStatus>()

	React.useEffect(() => {
		const mappedPlatformOptions = game!.platforms.map((platform: Platform) => ({
			platformData: platform,
			value: platform.platform_id,
			label: platform.platform_name
		}))
		setPlatformOptions(mappedPlatformOptions)
	}, [game.platforms])

	const handlePlatformChange = (value: PlatformLabelOptions) => {
		setSelectedPlatforms(value)
	}

	React.useEffect(() => {
		const mappedPlatformOptions = game.platforms.map((platform: Platform) => ({
			platformData: platform,
			value: platform.platform_id,
			label: platform.platform_name
		}))
		setPlatformOptions(mappedPlatformOptions)
	}, [game.platforms])

	const handleGameplayStatusChange = (value: Record<string, any>) => {
		setSelectedGameplayStatus(value)
	}

	const addGameToList = () => {
		const addedPlatforms = selectedPlatforms.map((platform: PlatformLabelOptions) => ({ ...platform.platformData }))
		handleAddGameToList(game, listName, index, selectedGameplayStatus ?? GamePlayStatus.NOT_PLAYED, addedPlatforms)
	}

	return (
		<Dialog open={isOpen} handler={setIsDialogOpen} className="h-[300px]">
			<div className="h-full w-[250px] mx-auto py-4 relative h-xl">
				<div className="grid grid-cols-2 border-b-2 pb-2 mb-2">
					<h4 className="text-left">One more thing...</h4>
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
						options={[
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
						]}
					/>
				</div>
				{/* TODO: Reconsider the decision to disable here */}
				<div className="absolute bottom-3 w-full">
					<button
						// disabled={!selectedGameplayStatus && !platformOptions.length}
						onClick={addGameToList}
						className="btn btn-block btn-sm text-white"
					>
						+ Add to List
					</button>
				</div>
			</div>
		</Dialog>
	)
}

export default BottomDrawerDialog

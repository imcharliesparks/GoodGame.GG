// @ts-nocheck
import { GamePlayStatus, ListWithOwnership, MobyGame, Platform } from '@/shared/types'
import { Dialog } from '@material-tailwind/react'
import React from 'react'
import Icon from 'react-icons-kit'
import Select from 'react-tailwindcss-select'
import { ic_close } from 'react-icons-kit/md/ic_close'
import styles from '../../styles/components/AddToListDialog.module.css'
import { handleAddGameToList } from '@/shared/utils'
import { useRouter } from 'next/router'

type AddToListDialogProps = {
	isOpen: boolean
	setIsDialogOpen: () => void
	listName: string
	index: number
	game: MobyGame
	setListsWithOwnership: (list: ListWithOwnership[]) => void
}

type PlatformLabelOptions = {
	label: string
	disabled?: boolean
	value: number
	platformData: Platform
}

const AddToListDialog = ({
	game,
	setIsDialogOpen,
	listName,
	index,
	isOpen,
	setListsWithOwnership
}: AddToListDialogProps) => {
	const router = useRouter()
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

	const addGameToList = async () => {
		const addedPlatforms = selectedPlatforms.map((platform: PlatformLabelOptions) => ({ ...platform.platformData }))
		await handleAddGameToList(
			game,
			listName,
			index,
			selectedGameplayStatus ?? undefined,
			addedPlatforms,
			router,
			setListsWithOwnership
		)
		setIsDialogOpen(false)
	}

	return (
		<Dialog id={styles.addToListDialog} size="xs" open={isOpen} handler={setIsDialogOpen} className="h-[300px]">
			<div className="h-full relative h-xl">
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

export default AddToListDialog

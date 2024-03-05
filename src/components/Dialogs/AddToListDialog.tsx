import { GamePlayStatus, Platform, StoredGame } from '@/shared/types'
import { Dialog } from '@material-tailwind/react'
import React from 'react'
import Icon from 'react-icons-kit'
import Select from 'react-tailwindcss-select'
import { ic_close } from 'react-icons-kit/md/ic_close'
import styles from '../../styles/components/DialogBase.module.css'
import { Button } from '@material-tailwind/react'
import { useAddGameToList, useCurrentlySelectedGame, useCurrentlySelectedList } from '../hooks/useStateHooks'
import { Option, SelectValue } from 'react-tailwindcss-select/dist/components/type'

type AddToListDialogProps = {
	isOpen: boolean
	setIsDialogOpen: () => void
}

// TODO: Clean this up a bit and use this type again tbh
type PlatformLabelOptions = {
	label: string
	disabled?: boolean
	value: number
	platformData: Platform
}

const AddToListDialog = ({ setIsDialogOpen, isOpen }: AddToListDialogProps) => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [selectedPlatforms, setSelectedPlatforms] = React.useState<SelectValue>([])
	const [platformOptions, setPlatformOptions] = React.useState<Option[]>([])
	const [selectedGameplayStatus, setSelectedGameplayStatus] = React.useState<SelectValue>()
	const [game] = useCurrentlySelectedGame()
	const addGameToList = useAddGameToList()
	const [listName] = useCurrentlySelectedList()

	React.useEffect(() => {
		if (game) {
			const mappedPlatformOptions = game!.platforms.map((platform: Platform) => ({
				platformData: platform,
				value: platform.platform_id,
				label: platform.platform_name
			}))
			// @ts-ignore
			setPlatformOptions(mappedPlatformOptions)
		}
	}, [game])

	const handlePlatformChange = (value: SelectValue) => {
		setSelectedPlatforms(value)
	}

	const handleGameplayStatusChange = (value: SelectValue) => {
		setSelectedGameplayStatus(value)
	}

	const handleTeardown = () => {
		setSelectedPlatforms([])
		setPlatformOptions([])
		setSelectedGameplayStatus(undefined)
		setIsDialogOpen()
	}

	const handleAddGameToList = async () => {
		setIsLoading(true)
		// @ts-ignore
		const ownedPlatforms = selectedPlatforms.reduce((prev: Platform[], curr: SelectValue) => {
			const platform: Platform = {
				// @ts-ignore
				...curr.platformData
			}

			return [...prev, platform]
		}, [])

		const { game_id, moby_score, sample_cover, title, description } = game!
		const payload: Omit<StoredGame, 'dateAdded'> = {
			game_id,
			moby_score,
			sample_cover,
			title,
			ownedPlatforms,
			platforms: game.platforms,
			// @ts-ignore
			playStatus: selectedGameplayStatus.value ?? GamePlayStatus.NOT_PLAYED,
			description: description ?? 'No Description Found'
		}

		// TODO: Toast here
		try {
			addGameToList(payload, listName)
			handleTeardown()
		} catch (error) {
			console.log('shit didnt work')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog id={styles.dialogBase} size="xs" open={isOpen} handler={() => setIsDialogOpen()} className="max-h-full">
			<div className="flex flex-col">
				<div className="grid grid-cols-2 border-b-2 pb-2 mb-2">
					<h4 className="text-left">Add Game to List</h4>
					<div autoFocus onClick={setIsDialogOpen} className="cursor-pointer text-right">
						<Icon icon={ic_close} size={24} />
					</div>
				</div>
				<div className="mb-3 flex-grow">
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
						value={selectedGameplayStatus!}
						onChange={handleGameplayStatusChange}
						options={[
							{
								label: GamePlayStatus.NOT_PLAYED,
								value: GamePlayStatus.NOT_PLAYED
							},
							{
								label: GamePlayStatus.STARTED,
								value: GamePlayStatus.STARTED
							},
							{
								label: GamePlayStatus.COMPLETED,
								value: GamePlayStatus.COMPLETED
							}
						]}
					/>
				</div>
				{/* TODO: Reconsider the decision to disable here */}
				<div className="mt-auto">
					<Button
						loading={isLoading}
						onClick={handleAddGameToList}
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
						<span className="tracking-wide font-normal">Add to List</span>
					</Button>
				</div>
			</div>
		</Dialog>
	)
}

export default AddToListDialog

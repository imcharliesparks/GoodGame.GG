//@ts-nocheck

import { GamePlayStatus, Platform } from '@/shared/types'
import React from 'react'
import Icon from 'react-icons-kit'
import Select from 'react-tailwindcss-select'
import { ic_close } from 'react-icons-kit/md/ic_close'

type SecondaryInfoAddToListDialogContentsProps = {
	handleAddGameToList: (
		listName: string,
		index: number,
		playStatus: GamePlayStatus,
		platform: Platform[]
	) => Promise<boolean>
	platforms: Platform[]
	setIsModalOpen: (isOpen: boolean) => void
	listName: string
	index: number
}

type PlatformLabelOptions = {
	label: string
	disabled?: boolean
	value: number
	platformData: Platform
}

const SecondaryInfoAddToListDialogContents = ({
	handleAddGameToList,
	platforms,
	setIsModalOpen,
	listName,
	index
}: SecondaryInfoAddToListDialogContentsProps) => {
	const [selectedPlatforms, setSelectedPlatforms] = React.useState<PlatformLabelOptions>()
	const [platformOptions, setPlatformOptions] = React.useState<Record<any, any>>([])
	const [selectedGameplayStatus, setSelectedGameplayStatus] = React.useState<GamePlayStatus>()

	React.useEffect(() => {
		const mappedPlatformOptions = platforms.map((platform: Platform) => ({
			platformData: platform,
			value: platform.platform_id,
			label: platform.platform_name
		}))
		setPlatformOptions(mappedPlatformOptions)
	}, [platforms])

	const handlePlatformChange = (value: PlatformLabelOptions) => {
		setSelectedPlatforms(value)
	}

	React.useEffect(() => {
		const mappedPlatformOptions = platforms.map((platform: Platform) => ({
			platformData: platform,
			value: platform.platform_id,
			label: platform.platform_name
		}))
		setPlatformOptions(mappedPlatformOptions)
	}, [platforms])

	const handleGameplayStatusChange = (value: Record<string, any>) => {
		setSelectedGameplayStatus(value)
	}

	const addGameToList = () => {
		const addedPlatforms = selectedPlatforms.map((platform: PlatformLabelOptions) => ({ ...platform.platformData }))
		handleAddGameToList(listName, index, selectedGameplayStatus.value, addedPlatforms)
	}

	return (
		<div className="h-full w-[250px] mx-auto py-4 relative">
			<div className="grid grid-cols-2 border-b-2 pb-2 mb-2">
				<h4 className="text-left">One more thing...</h4>
				<div autoFocus onClick={() => setIsModalOpen(false)} className="cursor-pointer text-right">
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
			<div className="absolute bottom-3 w-full">
				<button onClick={addGameToList} className="btn btn-block btn-sm text-white">
					+ Add to List
				</button>
			</div>
		</div>
	)
}

export default SecondaryInfoAddToListDialogContents

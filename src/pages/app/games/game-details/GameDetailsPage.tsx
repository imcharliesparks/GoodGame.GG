import GameDetailsBottomDrawer from '@/components/Drawers/BottomDrawer/GameDetailsBottomDrawer'
import GameDetailsMobileTop from '@/components/general/GameDetailsPage/GameDetailsMobileTop'
import GameDetailsPageLeft from '@/components/general/GameDetailsPage/GameDetailsPageLeft'
import GameDetailsPageRight from '@/components/general/GameDetailsPage/GameDetailsPageRight'
import useScreenSize from '@/components/hooks/useScreenSize'
import {
	APIMethods,
	APIStatuses,
	GamePlayStatus,
	ListWithOwnership,
	MobyGame,
	Platform,
	StoredGame
} from '@/shared/types'
import { handleUpdateListsWithOwnership } from '@/shared/utils'
import router from 'next/router'
import React from 'react'
import { GameDetailsPageProps } from './[game_id]'

// TODO: Replace alerts with toasts
export const GameDetailsPage = ({
	game,
	hasGame,
	listsWithOwnership: initialListsWithOwnership,
	error
}: GameDetailsPageProps) => {
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)
	const [listsWithOwnership, setListsWithOwnership] = React.useState<ListWithOwnership[]>(initialListsWithOwnership)
	const [showFullDescription, setShowFullDescription] = React.useState<boolean>(false)
	const [openBottom, setOpenBottom] = React.useState(false)

	const openDrawerBottom = () => setOpenBottom(true)
	const closeDrawerBottom = () => setOpenBottom(false)
	const screenSize = useScreenSize()

	const platformList =
		game?.platforms.reduce((platforms: string, platform: Platform, index: number) => {
			return index === 0 ? `${platform.platform_name} | ` : `${platforms} ${platform.platform_name}`
		}, '') ?? ''

	const handleAddGameToList = async (
		game: MobyGame,
		listName: string,
		index: number,
		playStatus: Record<any, any>,
		platforms: Platform[]
	) => {
		let success: boolean = false

		try {
			const { game_id, moby_score, sample_cover, title, description } = game!
			const payload: Omit<StoredGame, 'dateAdded'> = {
				game_id,
				moby_score,
				sample_cover,
				title,
				platform: platforms.reduce(
					(prev: string, platform: Platform, i: number) =>
						i === 0 ? `${platform.platform_name}` : `${prev}, ${platform.platform_name}`,
					''
				),
				playStatus: playStatus.value ?? GamePlayStatus.NOT_PLAYED,
				description: description ?? 'No Description Found'
			}

			console.log('payload', payload)

			const request = await fetch(`/api/lists/${listName}/update`, {
				method: APIMethods.PATCH,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				handleUpdateListsWithOwnership(index, true, setListsWithOwnership)
				success = true
				alert(`Success! We've added ${game!.title} to your ${listName} list.`)
				// handleShowSuccessToast(`Success! We've added ${currentlySelectedGame!.title} to your ${listName} list.`)
				router.replace(router.asPath)
			}
		} catch (error) {
			console.error(`Unable to add game to list`, error)
			alert(
				`We couldn't add ${
					// @ts-ignore
					game ? game.title : 'NO TITLE'
				} to your ${listName} list. Please try again in a bit.`
			)
			// handleShowErrorToast(
			// 	`We couldn't add ${
			// 		// @ts-ignore
			// 		currentlySelectedGame ? currentlySelectedGame.title : 'NO TITLE'
			// 	} to your ${listName} list. Please try again in a bit.`
			// )
		} finally {
			return success
		}
	}

	const handleDeleteGameFromList = async (listName: string, index: number): Promise<boolean> => {
		let success: boolean = false

		try {
			const { game_id } = game!

			const request = await fetch(`/api/lists/${listName}/${game_id}/remove`, {
				method: APIMethods.DELETE,
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const response = await request.json()
			if (response.status === APIStatuses.ERROR) {
				throw new Error(response.data.error)
			} else {
				handleUpdateListsWithOwnership(index, false, setListsWithOwnership)
				success = true
				// handleShowSuccessToast(`We've Deleted ${currentlySelectedGame!.title} to your ${listName} list.`)
				alert(`We've Deleted ${game!.title} to your ${listName} list.`)
				router.replace(router.asPath)
			}
		} catch (error) {
			console.error(`Unable to remove game from list`, error)
			alert(
				`We couldn't remove ${
					// @ts-ignore
					game ? game.title : 'NO TITLE'
				} from your ${listName} list. Please try again in a bit.`
			)
		} finally {
			return success
		}
	}

	// TODO: Do something better here
	if (!game) return <h1>No game found!</h1>

	return (
		<div>
			{screenSize === 'desktop' ? (
				<div className="grid grid-cols-12 container p-12 mx-auto">
					<div className=" col-span-5">
						<GameDetailsPageLeft game={game} hasGame={hasGame ?? false} openDrawerBottom={openDrawerBottom} />
					</div>
					<div className=" col-span-7">
						<GameDetailsPageRight platformList={platformList} game={game} hasGame={hasGame ?? false} />
					</div>
				</div>
			) : (
				<GameDetailsMobileTop
					openDrawerBottom={openDrawerBottom}
					game={game}
					hasGame={hasGame ?? false}
					platformList={platformList}
				/>
			)}

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

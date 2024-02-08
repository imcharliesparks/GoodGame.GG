import GameDetailsBottomDrawer from '@/components/Drawers/BottomDrawer/GameDetailsBottomDrawer'
import GameDetailsMobileTop from '@/components/general/GameDetailsPage/GameDetailsMobileTop'
import GameDetailsPageLeft from '@/components/general/GameDetailsPage/GameDetailsPageLeft'
import GameDetailsPageRight from '@/components/general/GameDetailsPage/GameDetailsPageRight'
import useScreenSize from '@/components/hooks/useScreenSize'
import firebase_app from '@/lib/firebase'
import { getGameByGameId } from '@/shared/serverMethods'
import { APIMethods, APIStatuses, CollectionNames, GGUser, ListWithOwnership, MobyGame, Platform } from '@/shared/types'
import { getListsWithOwnership, handleUpdateListsWithOwnership } from '@/shared/utils'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import router from 'next/router'
import React from 'react'

type GameDetailsPageProps = {
	game?: MobyGame
	hasGame: boolean
	listsWithOwnership: ListWithOwnership[]
	error?: string
}

// TODO: Replace alerts with toasts
const GameDetailsPage = ({
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
				setListsWithOwnership={setListsWithOwnership}
			/>
		</div>
	)
}

export default GameDetailsPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { userId } = getAuth(ctx.req)
	const game_id = ctx.query.game_id as string
	const props: GameDetailsPageProps = {
		listsWithOwnership: [],
		hasGame: false
	}

	if (!userId || !game_id) {
		return {
			props: {
				error: 'Not all parameters found'
			}
		}
	}

	try {
		const db = getFirestore(firebase_app)
		const userCollectionRef = collection(db, CollectionNames.USERS)
		const q = query(userCollectionRef, where('clerkId', '==', userId))
		const querySnapshot = await getDocs(q)
		let listsWithOwnership: ListWithOwnership[] = []

		if (!querySnapshot.empty) {
			const user = querySnapshot.docs[0].data() as GGUser
			const [hasGame, lists] = getListsWithOwnership(user, game_id)
			listsWithOwnership = lists as ListWithOwnership[]

			props.hasGame = hasGame as boolean
			props.listsWithOwnership = listsWithOwnership
		}

		const foundGameDetails = await getGameByGameId(game_id)

		if (foundGameDetails) {
			props.game = foundGameDetails
		}

		return {
			props
		}
	} catch (error) {
		return {
			props: {
				...props,
				error: 'Not all parameters found'
			}
		}
	}
}

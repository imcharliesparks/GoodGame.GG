import GameDetailsBottomDrawer from '@/components/Drawers/BottomDrawer/GameDetailsBottomDrawer'
import GameDetailsMobileTop from '@/components/general/GameDetailsPage/GameDetailsMobileTop'
import GameDetailsPageLeft from '@/components/general/GameDetailsPage/GameDetailsPageLeft'
import GameDetailsPageRight from '@/components/general/GameDetailsPage/GameDetailsPageRight'
import useScreenSize from '@/components/hooks/useScreenSize'
import { useCurrentlySelectedGame, useListsWithOwnership, useUserListsState } from '@/components/hooks/useStateHooks'
import firebase_app from '@/lib/firebase'
import { getGameByGameId } from '@/shared/serverMethods'
import { CollectionNames, GGLists, GGUser, ListWithOwnership, MobyGame, Platform } from '@/shared/types'
import { convertFirebaseTimestamps, getListsWithOwnership } from '@/shared/utils'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import React from 'react'

type GameDetailsPageProps = {
	game?: MobyGame
	hasGame: boolean
	lists: GGLists
	error?: string
}

// TODO: Replace alerts with toasts
// TODO: Use lists with ownership for owned platforms here
const GameDetailsPage = ({ game, hasGame, lists, error }: GameDetailsPageProps) => {
	const [selectedGame, setSelectedGame] = useCurrentlySelectedGame()
	const [openBottom, setOpenBottom] = React.useState(false)

	React.useEffect(() => {
		console.log('openBottom', openBottom)
		if (game) {
			setSelectedGame(game)
		}
	}, [game])

	const openDrawerBottom = () => setOpenBottom(true)
	const closeDrawerBottom = () => setOpenBottom(false)
	const screenSize = useScreenSize()

	const platformList =
		selectedGame?.platforms.length === 1
			? selectedGame.platforms[0].platform_name
			: selectedGame?.platforms.reduce((platforms: string, platform: Platform, index: number) => {
					return index === 0 ? `${platform.platform_name} | ` : `${platforms} ${platform.platform_name}`
			  }, '') ?? ''

	// TODO: Do something better here
	if (!selectedGame) return <h1>No game found!</h1>

	return (
		<div>
			<div className="md:grid hidden grid-cols-12 container p-12 mx-auto">
				<div className=" col-span-5">
					<GameDetailsPageLeft
						game={selectedGame as MobyGame}
						hasGame={hasGame ?? false}
						openDrawerBottom={openDrawerBottom}
					/>
				</div>
				<div className="col-span-7">
					<GameDetailsPageRight platformList={platformList} game={selectedGame as MobyGame} hasGame={hasGame ?? false} />
				</div>
			</div>
			<div className="block md:hidden">
				<GameDetailsMobileTop
					openDrawerBottom={openDrawerBottom}
					game={selectedGame as MobyGame}
					hasGame={hasGame ?? false}
					platformList={platformList}
				/>
			</div>

			{/* @ts-ignore */}
			<GameDetailsBottomDrawer storedGame={selectedGame} open={openBottom} close={closeDrawerBottom} />
		</div>
	)
}

export default GameDetailsPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { userId } = getAuth(ctx.req)
	const game_id = ctx.query.game_id as string
	const props: GameDetailsPageProps = {
		lists: {},
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

		if (!querySnapshot.empty) {
			const { lists } = Object.assign(querySnapshot.docs[0].data(), {})

			for (const listName in lists) {
				convertFirebaseTimestamps(lists[listName])
				// TODO: Move has game to the global store as well
				if (lists[listName][game_id]) props.hasGame = true
			}
			if (lists && Object.keys(lists).length) {
				props.lists = lists
			}
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

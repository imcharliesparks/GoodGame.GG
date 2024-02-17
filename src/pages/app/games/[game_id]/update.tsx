import GameDetailsBottomDrawer from '@/components/Drawers/BottomDrawer/GameDetailsBottomDrawer'
import GameDetailsMobileTop from '@/components/general/GameDetailsPage/GameDetailsMobileTop'
import GameDetailsPageLeft from '@/components/general/GameDetailsPage/GameDetailsPageLeft'
import GameDetailsPageRight from '@/components/general/GameDetailsPage/GameDetailsPageRight'
import UpdateGamePageLeft from '@/components/general/UpdateGamePage/UpdateGamePageLeft'
import UpdateGamePageMobile from '@/components/general/UpdateGamePage/UpdateGamePageMobile'
import UpdateGamePageRight from '@/components/general/UpdateGamePage/UpdateGamePageRight'
import firebase_app from '@/lib/firebase'
import { getGameByGameId } from '@/shared/serverMethods'
import { CollectionNames, GGUser, ListWithOwnership, MobyGame, Platform, StoredGame } from '@/shared/types'
import { getListsWithOwnership } from '@/shared/utils'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import React from 'react'

type GameUpdatePageProps = {
	game?: MobyGame
	storedGame?: StoredGame
	hasGame: boolean
	listsWithOwnership: ListWithOwnership[]
	error?: string
}

// TODO: Replace alerts with toasts
// TODO: Implement error here
const GameUpdatePage = ({
	game,
	storedGame,
	hasGame,
	listsWithOwnership: initialListsWithOwnership,
	error
}: GameUpdatePageProps) => {
	const [listsWithOwnership, setListsWithOwnership] = React.useState<ListWithOwnership[]>(initialListsWithOwnership)
	const [ownedPlatforms, setOwnedPlatforms] = React.useState<Platform[]>([])
	const [openBottom, setOpenBottom] = React.useState(false)

	React.useEffect(() => {
		let currentOwnedPlatforms: Platform[] = []
		initialListsWithOwnership.forEach((list: ListWithOwnership) => {
			if (list.hasGame) currentOwnedPlatforms = [...currentOwnedPlatforms, ...list.platforms]
		})
		setOwnedPlatforms(currentOwnedPlatforms)
	}, [])

	const openDrawerBottom = () => setOpenBottom(true)
	const closeDrawerBottom = () => setOpenBottom(false)

	const platformList =
		ownedPlatforms.reduce((platforms, platform, index) => {
			const separator = index < ownedPlatforms.length - 1 ? ' | ' : ''
			return `${platforms}${index > 0 ? ' ' : ''}${platform.platform_name}${separator}`
		}, '') ?? ''

	// TODO: Do something better here
	if (!game) return <h1>No game found!</h1>

	return (
		<div>
			<div className="md:grid hidden grid-cols-12 container p-12 mx-auto">
				<div className=" col-span-5">
					<UpdateGamePageLeft game={game} hasGame={hasGame ?? false} openDrawerBottom={openDrawerBottom} />
				</div>
				<div className="col-span-7">
					<UpdateGamePageRight platformList={platformList} game={game} hasGame={hasGame ?? false} />
				</div>
			</div>
			<div className="block md:hidden">
				<UpdateGamePageMobile openDrawerBottom={openDrawerBottom} game={game} platformList={platformList} />
			</div>

			{/* garf start here make a modified version that opens the add dialog regardless of click */}
			<GameDetailsBottomDrawer open={openBottom} close={closeDrawerBottom} storedGame={storedGame} />
		</div>
	)
}

export default GameUpdatePage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { userId } = getAuth(ctx.req)
	const game_id = ctx.query.game_id as string
	const props: GameUpdatePageProps = {
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
			if (hasGame) {
				for (let userList in user.lists) {
					if (user.lists[userList][game_id]) {
						const foundStoredGame = user.lists[userList][game_id]
						foundStoredGame.dateAdded = foundStoredGame.dateAdded ? foundStoredGame.dateAdded.toString() : ''
						foundStoredGame.lastUpdated = foundStoredGame.lastUpdated ? foundStoredGame.lastUpdated.toString() : ''
						props.storedGame = foundStoredGame
					}
				}
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

import GameDetailsMobileTop from '@/components/general/GameDetailsPage/GameDetailsMobileTop'
import GameDetailsPageLeft from '@/components/general/GameDetailsPage/GameDetailsPageLeft'
import GameDetailsPageRight from '@/components/general/GameDetailsPage/GameDetailsPageRight'
import useScreenSize from '@/components/hooks/useScreenSize'
import firebase_app from '@/lib/firebase'
import { getGameByGameId } from '@/shared/serverMethods'
import { CollectionNames, GGUser, MobyGame, Platform, StoredGame } from '@/shared/types'
import { findListsContainingGame } from '@/shared/utils'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import React from 'react'

type GameDetailsPageProps = {
	game?: MobyGame
	hasGame?: boolean
	listsWithGame?: string[]
	error?: string
}

const GameDetailsPage = ({ game, hasGame, listsWithGame, error }: GameDetailsPageProps) => {
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)
	const screenSize = useScreenSize()

	const platformList =
		game?.platforms.reduce((platforms: string, platform: Platform, index: number) => {
			return index === 0 ? `${platform.platform_name} | ` : `${platforms} ${platform.platform_name}`
		}, '') ?? ''

	// TODO: Do something better here
	if (!game) return <h1>No game found!</h1>

	return screenSize === 'desktop' ? (
		<div className="grid grid-cols-12 container p-12 mx-auto">
			<div className=" col-span-5">
				<GameDetailsPageLeft
					game={game}
					hasGame={hasGame ?? false}
					isModalOpen={isModalOpen}
					setIsModalOpen={() => setIsModalOpen(!isModalOpen)}
				/>
			</div>
			<div className=" col-span-7">
				<GameDetailsPageRight
					platformList={platformList}
					game={game}
					hasGame={hasGame ?? false}
					isModalOpen={isModalOpen}
					setIsModalOpen={() => setIsModalOpen(!isModalOpen)}
				/>
			</div>
		</div>
	) : (
		<GameDetailsMobileTop
			game={game}
			hasGame={hasGame ?? false}
			listsWithGame={listsWithGame ?? []}
			platformList={platformList}
			isModalOpen={isModalOpen}
			setIsModalOpen={() => setIsModalOpen(!isModalOpen)}
		/>
	)
}

export default GameDetailsPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { userId } = getAuth(ctx.req)
	const game_id = ctx.query.game_id as string
	const props: GameDetailsPageProps = {}

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
		let listsContainingGame: string[] = []

		if (!querySnapshot.empty) {
			const user = querySnapshot.docs[0].data() as GGUser
			listsContainingGame = findListsContainingGame(user, game_id)

			if (listsContainingGame.length) {
				props.hasGame = true
				props.listsWithGame = listsContainingGame
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
				error: 'Not all parameters found'
			}
		}
	}
}

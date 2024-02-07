import GameDetailsMobileTop from '@/components/general/GameDetailsPage/GameDetailsMobileTop'
import GameDetailsPageLeft from '@/components/general/GameDetailsPage/GameDetailsPageLeft'
import GameDetailsPageRight from '@/components/general/GameDetailsPage/GameDetailsPageRight'
import useScreenSize from '@/components/hooks/useScreenSize'
import firebase_app from '@/lib/firebase'
import { getGameByGameId } from '@/shared/serverMethods'
import {
	APIMethods,
	APIStatuses,
	CollectionNames,
	GGUser,
	GamePlayStatus,
	ListWithOwnership,
	MobyGame,
	Platform,
	StoredGame
} from '@/shared/types'
import { findListsContainingGame, getListsWithOwnership, handleUpdateListsWithOwnership } from '@/shared/utils'
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

const GameDetailsPage = ({
	game,
	hasGame,
	listsWithOwnership: initialListsWithOwnership,
	error
}: GameDetailsPageProps) => {
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)
	const [listsWithOwnership, setListsWithOwnership] = React.useState<ListWithOwnership[]>(initialListsWithOwnership)
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
			listsWithOwnership={listsWithOwnership}
			platformList={platformList}
			isModalOpen={isModalOpen}
			setIsModalOpen={() => setIsModalOpen(!isModalOpen)}
			handleAddGameToList={handleAddGameToList}
		/>
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

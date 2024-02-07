import GameDetailsPageLeft from '@/components/general/GameDetailsPage/GameDetailsPageLeft'
import firebase_app from '@/lib/firebase'
import { getGameByGameId, getGameByListName } from '@/shared/serverMethods'
import { APIMethods, APIStatuses, CollectionNames, GGUser, StoredGame } from '@/shared/types'
import { findListsContainingGame } from '@/shared/utils'
import { getAuth } from '@clerk/nextjs/server'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import React from 'react'

type GameDetailsPageProps = {
	game?: StoredGame
	hasGame?: boolean
	listsWithGame?: string[]
	error?: string
}

const GameDetailsPage = ({ game, error }: GameDetailsPageProps) => {
	return (
		<div className="grid grid-cols-12 container">
			{game ? (
				<>
					<div className=" col-span-5">
						<GameDetailsPageLeft game={game} hasGame />
					</div>
					<div className=" col-span-7">howdy</div>
				</>
			) : (
				<div>
					<h1>No game found!</h1>
				</div>
			)}
		</div>
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

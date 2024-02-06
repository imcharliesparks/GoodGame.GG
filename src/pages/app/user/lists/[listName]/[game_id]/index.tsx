import { getGameByListName } from '@/shared/serverMethods'
import { APIMethods, APIStatuses, StoredGame } from '@/shared/types'
import { getAuth } from '@clerk/nextjs/server'
import { GetServerSidePropsContext } from 'next'
import React from 'react'

type ViewGameDetailsFromListPageProps = {
	game?: StoredGame
	error?: string
}

const ViewGameDetailsFromListPage = ({ game, error }: ViewGameDetailsFromListPageProps) => {
	console.log('game', game)
	if (game)
		return (
			<div>
				<div>
					<h1>{game.title}</h1>
				</div>
			</div>
		)
	else return 'cheese'
}

export default ViewGameDetailsFromListPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { userId } = getAuth(ctx.req)
	const { listName, game_id } = ctx.query

	if (!userId || !listName || !game_id) {
		return {
			props: {
				error: 'Not all parameters found'
			}
		}
	}

	try {
		const foundGame: StoredGame = await getGameByListName(listName as string, game_id as string, userId)
		foundGame.dateAdded = foundGame.dateAdded ? foundGame.dateAdded?.toString() : ''
		foundGame.lastUpdated = foundGame.lastUpdated ? foundGame.lastUpdated?.toString() : ''

		return {
			props: {
				game: foundGame
			}
		}
	} catch (error) {
		return {
			props: {
				error: 'Not all parameters found'
			}
		}
	}
}

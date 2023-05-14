import {
	APIMethods,
	APIStatuses,
	DocumentResponses,
	FullGame,
	GameInCollection,
	GamePlayStatus,
	GeneralAPIResponses
} from '@/shared/types'
import { users, withAuth } from '@clerk/nextjs/dist/api'

const handler = withAuth(async (req, res) => {
	const { auth, body, method } = req
	const { userId } = auth
	const game: FullGame = body

	if (!userId) {
		console.error('User not authorized.')
		return res.status(401).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'User not authorized.' }
		})
	}

	if (!game) {
		console.error('No game provided to add-to-collection endpoint.')
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.FAILURE,
			data: { error: 'Game not provided to endpoint' }
		})
	}

	if (method === APIMethods.PATCH) {
		try {
			const user = await users.getUser(userId)
			const newGame: GameInCollection = {
				gameId: game.id,
				imageUrl: game.coverArt?.url,
				// BIG TOOD: Need to tweek the adding process so this is set when the user adds
				playStatus: GamePlayStatus.NOT_STARTED
			}
			const userGamesCollection: GameInCollection[] = (user.publicMetadata.gamesCollection as GameInCollection[]) ?? []
			const collectionSet: Set<string> = new Set(userGamesCollection.map((game) => JSON.stringify(game)))

			// TODO: Convert this & toast on FE to a warn instead of an error
			if (collectionSet.has(JSON.stringify(newGame))) {
				return res.status(400).json({
					status: APIStatuses.ERROR,
					type: DocumentResponses.DATA_NOT_UPDATED,
					data: { error: 'You already have this game in your collection!' }
				})
			}

			userGamesCollection.push(newGame)

			await users.updateUserMetadata(userId, {
				publicMetadata: {
					...user.publicMetadata,
					gamesCollection: userGamesCollection
				}
			})

			return res.status(200).json({
				status: APIStatuses.SUCCESS,
				type: DocumentResponses.DATA_UPDATED,
				data: { user }
			})
		} catch (error: any) {
			console.error(error)
			return res.status(400).json({
				status: APIStatuses.ERROR,
				type: GeneralAPIResponses.FAILURE,
				data: { error: error?.errors[0]?.longMessage ?? 'User not found.' }
			})
		}
	} else {
		console.error('Invalid request to add-to-collection endpoint.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
})

export default handler

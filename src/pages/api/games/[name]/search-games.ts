import { APIMethods, APIStatuses, DocumentResponses, FullGame, GeneralAPIResponses } from '@/shared/types'
import { withAuth } from '@clerk/nextjs/dist/api'
import { igDBFetch } from '@/shared/utils'

const handler = withAuth(async (req, res) => {
	const { method, query } = req
	const { name } = query

	if (!name) {
		console.error('No game provided to search-games endpoint.')
		return res.status(404).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.INVALID_REQUEST_TYPE,
			data: { error: 'No game provided to search.' }
		})
	}

	if (method === APIMethods.POST) {
		try {
			const gamesAPIResponse = await igDBFetch('/games', APIMethods.POST, `fields *; search "${name}";`)

			if (gamesAPIResponse.length) {
				const foundGamesPromises = await gamesAPIResponse.map(async (game: FullGame) => {
					const updatedGame = { ...game }
					try {
						const coverArtAPIResponse = await igDBFetch(
							'/covers',
							APIMethods.POST,
							`fields url, height, width; where game = ${game.id};`
						)
						if (coverArtAPIResponse.length) {
							const [coverArt] = coverArtAPIResponse
							const fullArtURL = `https:${coverArt.url.replace('t_thumb', 't_cover_big')}`
							updatedGame.coverArt = {
								url: fullArtURL,
								height: coverArt.height,
								width: coverArt.width
							}
						}
					} catch (error) {
						console.error(`Unable to get artwork for ${game.name}`)
					}
					return updatedGame
				})
				const foundGames = await Promise.all(foundGamesPromises) // TODO: There's gotta be a better way to do this but for of loops take mf forever

				res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_FOUND,
					data: foundGames
				})
			} else {
				console.error('No games found.')
				return res
					.status(404)
					.json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.FAILURE, data: { error: 'No games found' } })
			}
		} catch (error) {
			console.error(error)
			return res.status(400).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.FAILURE })
		}
	} else {
		console.error('Invalid request to search-games')
		return res.status(400).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
})

export default handler

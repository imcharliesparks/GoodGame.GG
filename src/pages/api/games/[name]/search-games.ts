import {
	APIMethods,
	APIStatuses,
	DocumentResponses,
	IGDBGame,
	GeneralAPIResponses,
	GGGame,
	GamePlayStatus,
	GamePlatform
} from '@/shared/types'
import { withAuth } from '@clerk/nextjs/dist/api'
import { igDBFetch } from '@/shared/utils'

// TODO: Speed this shit up
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
			const foundGames: GGGame[] = []
			if (gamesAPIResponse.length) {
				for (let i = 0; i < gamesAPIResponse.length; i++) {
					const game: IGDBGame = gamesAPIResponse[i]
					try {
						const coverArtAPIResponse = await igDBFetch(
							'/covers',
							APIMethods.POST,
							`fields url, height, width; where game = ${game.id};`
						)
						// TODO: Reinstate these when we need them to speed shit up!
						// TODO: Scrape genres in the future
						// const genresAPIResponse = await igDBFetch(
						// 	'/genres',
						// 	APIMethods.POST,
						// 	`fields name; where id = ${game.genres[0]};`
						// )
						// const [foundGenre] = genresAPIResponse
						const foundGenre = {
							name: 'FIGHTING',
							id: 1
						}

						// TODO: Scrape platforms as well
						const platforms: GamePlatform[] = []
						// for (let j = 0; j < game.platforms.length; j++) {
						// 	const platformsAPIResponse = await igDBFetch(
						// 		'/platforms',
						// 		APIMethods.POST,
						// 		`fields name; where id = ${game.platforms[j]};`
						// 	)
						// 	platforms.push(platformsAPIResponse[0])
						// }

						let gameCoverArt
						if (coverArtAPIResponse.length) {
							const [coverArt] = coverArtAPIResponse
							gameCoverArt = {
								imageUrl: `https:${coverArt.url.replace('t_thumb', 't_cover_big')}`,
								height: coverArt.height,
								width: coverArt.width
							}
						}

						const newGame: GGGame = {
							gameId: game.id,
							coverArt: gameCoverArt,
							// TODO: Make this dynamic by pulling user data on it
							playStatus: GamePlayStatus.NOT_PLAYED,
							releaseDate: game.first_release_date,
							genre: {
								id: foundGenre.id,
								name: foundGenre.name
							},
							name: game.name,
							platforms: platforms,
							summary: game.summary,
							slug: game.slug
						}

						foundGames.push(newGame)
					} catch (error) {
						console.error(`Unable to get artwork for ${game.name}`)
					}
				}

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

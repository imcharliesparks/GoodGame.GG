import { APIMethods, APIStatuses, DocumentResponses, ESRBRatings, GeneralAPIResponses, GGGame } from '@/shared/types'
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
			const gamesAPIResponse = await igDBFetch(
				'/games',
				APIMethods.POST,
				`
					search "${name}"; 
					fields id,name,cover.url,cover.height,cover.width,first_release_date,genres.name,platforms.name,summary,slug,total_rating,total_rating_count,involved_companies.company.name,age_ratings.category,age_ratings.rating;
				`
			)
			if (gamesAPIResponse.length) {
				const foundGames: GGGame[] = gamesAPIResponse.map((game: any) => {
					let ageRating

					game.age_ratings.find((rating: any) => {
						if (rating.category === 1) {
							const ratingNumber = rating.rating.toString()
							// @ts-ignore
							const esrbRating = ESRBRatings[ratingNumber]
							ageRating = {
								ratingName: esrbRating,
								ratingNumber: rating.rating
							}
							return
						}
					})!

					const formattedGame: GGGame = {
						gameId: game.id,
						coverArt: {
							...game.cover,
							imageUrl: `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
						},
						releaseDate: game.first_release_date,
						genres: game.genres,
						companies: game.involved_companies,
						name: game.name,
						platforms: game.platforms,
						slug: game.slug,
						summary: game.summary,
						// @ts-ignore
						ageRating,
						userAndCriticAggregateRating: game.total_rating,
						numberOfReviews: game.total_rating_count
					}

					return formattedGame
				})

				// TODO Refactor all usages of data responses to be nested objects
				res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_FOUND,
					data: { foundGames }
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

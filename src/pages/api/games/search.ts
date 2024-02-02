import { MobyGamesSearchSchema } from '@/shared/ValidationSchemas'
import { SubstandardGenres } from '@/shared/constants'
import {
	APIMethods,
	APIStatuses,
	GeneralAPIResponses,
	MobyAPIGameSearchParameters,
	MobyGame,
	TypedRequest
} from '@/shared/types'
import { getAuth } from '@clerk/nextjs/server'
import { NextApiResponse } from 'next'
import { convert } from 'html-to-text'

const handler = async (req: TypedRequest<MobyAPIGameSearchParameters>, res: NextApiResponse) => {
	const { method, body: searchParameters } = req
	const { userId } = getAuth(req)
	const { error: validationError } = MobyGamesSearchSchema.validate(searchParameters)

	if (!userId) {
		console.error('User is not authenticated.')
		return res.status(404).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.UNAUTHORIZED,
			data: { error: 'No game provided to search.' }
		})
	}

	if (validationError) {
		console.log('validationError', validationError)
		console.error('Search request body did not pass validation check')
		return res.status(400).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.UNAUTHORIZED,
			data: { error: 'Search request body did not pass validation check' }
		})
	}

	if (method === APIMethods.POST) {
		try {
			let reqUrl = `https://api.mobygames.com/v1/games?format=normal&api_key=${process.env.MOBY_GAMES_API_KEY}&title=${searchParameters.title}`

			if (searchParameters.genre) {
				reqUrl += `&genre=${searchParameters.genre}`
			}

			if (searchParameters.platform) {
				reqUrl += `&platform=${searchParameters.platform}`
			}

			const request = await fetch(reqUrl)
			const response = await request.json()
			if (response.games && response.games.length) {
				const filteredGamesList = response.games.filter(
					(game: MobyGame) => !SubstandardGenres.has(game.genres[0].genre_name)
				)
				const finalGamesList = filteredGamesList.map((game: MobyGame) => ({
					...game,
					description: convert(
						game.description,
						{ selectors: [{ selector: 'a', options: { ignoreHref: true } }] },
						{ selector: 'img', options: { ignoreHref: true } }
					)
				}))
				return res.json({ data: { games: finalGamesList } })
			} else {
				throw new Error('No games by that title were found!')
			}
		} catch (error) {
			console.error(error)
			return res.status(400).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.FAILURE })
		}
	} else {
		console.error('Invalid request to search games endpoint')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

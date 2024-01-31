import { mobyGamesSearchSchema } from '@/shared/ValidationSchemas'
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
	const { error: schemaError } = mobyGamesSearchSchema.validate(searchParameters)

	if (!userId) {
		console.error('User is not authenticated.')
		return res.status(404).json({
			status: APIStatuses.ERROR,
			type: GeneralAPIResponses.UNAUTHORIZED,
			data: { error: 'No game provided to search.' }
		})
	}

	if (schemaError) {
		console.log('schemaError', schemaError)
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
			const filteredGamesList = response.games.filter(
				(game: MobyGame) => !SubstandardGenres.has(game.genres[0].genre_name)
			)
			const finalGamesList = filteredGamesList.map((game: MobyGame) => {
				game.description = game.description.replace(/ \[.*?\]/g, '')
				game.description = convert(game.description)
				return game
			})
			// const finalGamesList = updatedGamesList.map((game: MobyGame) => {
			// 	game.description = game.description.replace(/ \[.*?\]/g, '')
			// 	console.log('game.description', game.description.replace(/ \[.*?\]/g, ''))
			// 	return game
			// })
			// finalGamesList.forEach((game: MobyGame) => {
			// 	game.description = game.description.replace(/ \[.*?\]/g, '')
			// 	console.log('game.description', game.description)
			// })
			return res.json({ data: { games: finalGamesList } })
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

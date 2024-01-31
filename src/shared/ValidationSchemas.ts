import Joi from 'joi'

export const mobyGamesSearchSchema = Joi.object({
	title: Joi.string().required(),
	genre: Joi.string().optional(),
	platform: Joi.string().optional()
})

import Joi from 'joi'
import { StoredGame } from './types'

export const MobyGamesSearchSchema = Joi.object({
	title: Joi.string().required(),
	genre: Joi.string().optional(),
	platform: Joi.string().optional()
})

export const GameToAddToCollectionSchema = Joi.object<StoredGame>({
	game_id: Joi.number().required(),
	moby_score: Joi.number().optional(),
	ownedPlatforms: Joi.array().required(),
	platforms: Joi.array().required(),
	sample_cover: Joi.object().optional(), // TODO: Flesh this out
	title: Joi.string().required(),
	description: Joi.string().optional(),
	playStatus: Joi.string().required(),
	dateAdded: Joi.string().optional(),
	lastUpdated: Joi.string().optional()
})

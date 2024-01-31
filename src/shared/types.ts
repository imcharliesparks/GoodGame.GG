import type { EmailAddress, ExternalAccount, PhoneNumber, Web3WalletJSON } from '@clerk/nextjs/server'
import { NextApiRequest, NextApiResponse } from 'next'

// TODO: Clean up/order by type
// General Types
export type Maybe<T> = T | null

// API Types
export interface TypedRequest<T> extends NextApiRequest {
	body: T
}

export interface TypedResponse<T> extends NextApiResponse {
	json: (data: T) => void
}

// IGDB Types
export type IGDBGame = {
	category: number
	checksum: string
	cover: Record<string, any>
	created_at: number
	external_games: number[]
	first_release_date: number
	genres: number[]
	id: number
	name: string
	platforms: number[]
	release_dates: number[]
	similar_games: number[]
	slug: string
	summary: string
	tags: number[]
	themes: number[]
	updated_at: number
	url: string
	websites: number[]
}

export enum APIStatuses {
	SUCCESS = 'SUCCESS',
	AMBIGUOUS = 'AMBIGUOUS',
	ERROR = 'ERROR'
}

export enum APIMethods {
	POST = 'POST',
	GET = 'GET',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH'
}

export enum DocumentResponses {
	DATA_FOUND = 'DATA_FOUND',
	DATA_NOT_FOUND = 'DATA_NOT_FOUND',
	DATA_DELETED = 'DATA_DELETED',
	DATA_UPDATED = 'DATA_UPDATED',
	DATA_CREATED = 'DATA_CREATED',
	DATA_NOT_CREATED = 'DATA_NOT_CREATED',
	DATA_NOT_UPDATED = 'DATA_NOT_UPDATED'
}

// User Types
export type ClerkUser = {
	id: string
	firstName: string | null
	lastName: string
	fullName: string | null
	username: string | null
	profileImageUrl: string | null
	primaryEmailAddress: EmailAddress | null
	primaryEmailAddressId: string | null
	emailAddresses: EmailAddress[]
	primaryPhoneNumber: PhoneNumber[] | null
	primaryPhoneNumberId: string | null
	phoneNumbers: PhoneNumber[]
	primaryWeb3WalletId: string | null
	web3Wallets: Web3WalletJSON[]
	externalAccounts: ExternalAccount[]
	passwordEnabled: boolean
	totpEnabled: boolean
	backupCodeEnabled: boolean
	publicMetadata: ClerkPublicUserData // readable from the FE and BE, should be used for safe data points
	privateMetadata: ClerkPrivateUserData // readable only from the BE, should be used for DP that need encryption or protection
	unsafeMetadata: { [key: string]: any } | null // readable only from the FE; this is only for properties mutated by the client directly
	lastSignInAt: Date
	createdAt: Date
	updatedAt: Date
}
export type GGUser = {
	clerkId: string
	friendIds: string[]
	collectionRef: string
	wishlistRef: string
}

export type UserByEmail = {
	id: string
	email: string
}

export type GGGame = {
	gameId: number
	name: string
	ageRating: {
		ratingName: string
		ratingNumber: number
	} | null
	coverArt: {
		height: number
		width: number
		imageUrl: string
		id: number
	}
	releaseDate: number
	genres: GameGenre[] // TODO convert to enum with scraping
	platforms: GamePlatform[] // TODO: Also convert to enum with scraping
	summary: string
	slug: string
	userAndCriticAggregateRating?: number
	numberOfReviews?: number
	companies: {
		id: number
		company: {
			id: number
			name: string
		}
	}
	aggregatedReviewScore?: number
	userRating?: number
	playStatus?: GamePlayStatus
	dateAdded?: number
}

export type GameCollection = {
	ownerId: string
	ownedGames: {
		[gameId: number]: GGGame
	}
}

// TODO: Expand out on the typings for these
export type GamesWishlist = {
	ownerId: string
	wantedGames: {
		[gameId: number]: GGGame
	}
}

export type GameGenre = {
	id: number
	name: string
}

export type GamePlatform = {
	id: number
	name: string
}

export type UserFriendsList = {
	ownerId: string
	friends: Friend[]
}

export type GGUsername = {
	ownerId: string
	username: string
}

export type Friend = {
	id: string
	firstName: string
	lastName?: string
	dateAdded: number
	mutual: boolean
}

// TODO: Type these properly and remove nullish-ness when we have shape of data
export type ClerkPublicUserData = {
	[key: string]: any
} | null

export type ClerkPrivateUserData = {
	[key: string]: any
} | null

export enum UserStatus {
	ADMIN = 'Admin',
	USER = 'User'
}

export enum GamePlayStatus {
	PLAYED = 'Played',
	COMPLETED = 'Completed',
	NOT_PLAYED = 'Not Played'
}

export enum GameCollectionStatus {
	OWNED = 'Owned',
	WISHLISTED = 'Wishlisted'
}

export enum CollectionNames {
	COLLECTIONS = 'collections',
	FRIENDS_LISTS = 'friendslists',
	WISH_LISTS = 'wishlists',
	FAVORITES = 'favorites',
	USERNAMES = 'usernames'
}

export const ESRBRatings = {
	'6': 'RP',
	'7': 'EC',
	'8': 'E',
	'9': 'E10',
	'10': 'T',
	'11': 'M',
	'12': 'AO'
}

export interface TypedRequest<T> extends NextApiRequest {
	body: T
}

export interface TypedResponse<T> extends NextApiResponse {
	json: (body: T) => void
	send: (body: T) => void
}

// Enums
export enum GeneralAPIResponses {
	FAILURE = 'FAILURE',
	INVALID_REQUEST_TYPE = 'INVALID_REQUEST_TYPE',
	UNAUTHORIZED = 'UNAUTHORIZED',
	NOT_FOUND = 'NOT_FOUND'
}

// Firebase Specific Enums
export enum CollectionNames {
	USERS = 'users'
}

// Auth Specific Enums
export enum ClerkResponses {
	USER_NOT_FOUND = 'USER_NOT_FOUND',
	USER_FOUND = 'USER_FOUND'
}

export enum SignupMethods {
	GOOGLE = 'Google',
	TWITCH = 'Twitch',
	EMAIL = 'Email',
	DISCORD = 'Discord'
}

export enum UserRoles {
	SUPER_ADMIN = 'Super Admin',
	ADMIN = 'Admin',
	USER = 'User'
}

export interface TypedRequest<T> extends NextApiRequest {
	body: T
}

export interface TypedResponse<T> extends NextApiResponse {
	json: (body: T) => void
	send: (body: T) => void
}

export enum TypeOfPerson {
	ADMIN = 'ADMIN',
	VISITOR = 'VISITOR',
	REGISTERED_VISITOR = 'REGISTERED_VISITOR'
}

export type MobyAPIGameSearchParameters = {
	title: string
	platform?: string
	genre?: string
}

// Types for Moby Games API
export type MobyGame = {
	alternate_titles: AlternateTitle[]
	description: string
	game_id: number
	genres: Genre[]
	moby_score: number
	moby_url: string
	num_votes: number
	official_url: string | null
	platforms: Platform[]
	sample_cover: SampleCover
	sample_screenshots: SampleScreenshot[]
	title: string
}

type AlternateTitle = {
	description: string
	title: string
}

export type Genre = {
	genre_category: string
	genre_category_id: number
	genre_id: number
	genre_name: string
}

type Platform = {
	first_release_date: string
	platform_id: number
	platform_name: string
}

type SampleCover = {
	height: number
	image: string
	platforms: string[]
	thumbnail_image: string
	width: number
}

type SampleScreenshot = {
	caption: string
	height: number
	image: string
	thumbnail_image: string
	width: number
}

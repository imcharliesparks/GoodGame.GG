import type { EmailAddress, ExternalAccount, PhoneNumber, Web3WalletJSON } from '@clerk/nextjs/server'
import { NextApiRequest, NextApiResponse } from 'next'

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
export type FullGame = {
	category: number
	checksum: string
	cover: number
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
	coverArt?: {
		url: string
		height: number
		width: number
	}
}

export enum APIStatuses {
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR'
}

export enum GeneralAPIResponses {
	FAILURE = 'FAILURE',
	INVALID_REQUEST_TYPE = 'INVALID_REQUEST_TYPE'
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

export type GameInCollection = {
	gameId: number
	imageUrl?: string
	playStatus: GamePlayStatus
}

// TODO: Type these properly and remove nullish-ness when we have shape of data
export type ClerkPublicUserData = {
	[key: string]: any
} | null

export type ClerkPrivateUserData = {
	[key: string]: any
} | null

export enum SignupMethods {
	GOOGLE = 'Google',
	TWITCH = 'Twitch',
	EMAIL = 'Email'
}

export enum UserStatus {
	ADMIN = 'Admin',
	USER = 'User'
}

export enum GamePlayStatus {
	PLAYED = 'Played',
	COMPLETED = 'Completed',
	NOT_STARTED = 'Not Started'
}

export enum GameCollectionStatus {
	OWNED = 'Owned',
	WISHLISTED = 'Wishlisted'
}

import type { EmailAddress, ExternalAccount, PhoneNumber, Web3WalletJSON } from '@clerk/nextjs/server'

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
	publicMetadata: ClerkPublicUserData
	privateMetadata: ClerkPrivateUserData
	unsafeMetadata: { [key: string]: any } | null // this is only for mutatble properties strictly on the FE
	lastSignInAt: Date
	createdAt: Date
	updatedAt: Date
}

// TODO: Type these properly and remove nullish-ness when we have shape of data
export type ClerkPublicUserData = {
	[key: string]: any
} | null

export type ClerkPrivateUserData = {
	[key: string]: any
} | null

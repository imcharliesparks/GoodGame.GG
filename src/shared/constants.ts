// TODO: removed unused here and make sure this isn't a infosec concern
export const IGDB_CLIENT_ID: string = process.env.IGDB_CLIENT_ID!
export const IGBD_CLIENT_SECRET_KEY: string = process.env.IGBD_CLIENT_SECRET_KEY!
export const IGDB_ACCESS_TOKEN: string = process.env.IGDB_ACCESS_TOKEN!
export const IGDB_BASE_URL = 'https://api.igdb.com/v4'
export const BASE_URL = process.env.BASE_URL!
export const MONGODB_URI: string = process.env.MONGODB_URI!
export const NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!
export const CLERK_SECRET_KEY: string = process.env.CLERK_SECRET_KEY!
export const FIREBASE_API_KEY: string = process.env.FIREBASE_API_KEY!
export const FIREBASE_AUTH_DOMAIN: string = process.env.FIREBASE_AUTH_DOMAIN!
export const FIREBASE_PROJECT_ID: string = process.env.FIREBASE_PROJECT_ID!
export const FIREBASE_STORAGE_BUCKET: string = process.env.FIREBASE_STORAGE_BUCKET!
export const FIREBASE_MESSAGING_SENDER_ID: string = process.env.FIREBASE_MESSAGING_SENDER_ID!
export const FIREBASE_APP_ID: string = process.env.FIREBASE_APP_ID!
export const FIREBASE_MEASUREMENT_ID: string = process.env.FIREBASE_MEASUREMENT_ID!

export const screenSizeBreakpoints = {
	xs: '375px',
	sm: '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
	'2xl': '1536px'
}

// These are the keys in `genre_name` that we want to ignore on searches in the Basic Genres category
export const SubstandardGenres = new Set<string>(['Add-on', 'Special edition'])

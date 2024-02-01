import { authMiddleware, redirectToSignIn } from '@clerk/nextjs'
import { getFirestore } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import firebase_app from './lib/firebase'

const beforeAuthMiddleware = (req: NextRequest) => {
	// TODO: Wire up
}

export default authMiddleware({
	publicRoutes: ['/'],
	afterAuth: async (auth, req, evt) => {
		if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
			if (!auth.userId && !auth.isPublicRoute) {
				return redirectToSignIn({ returnBackUrl: req.url })
			}
		}

		const request = await fetch(`/api/users/${auth.userId}/create`)
	}
})

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}

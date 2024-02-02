import { authMiddleware, clerkClient, redirectToSignIn } from '@clerk/nextjs'
import { getFirestore } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import firebase_app from './lib/firebase'
import { redirect } from 'next/dist/server/api-utils'

const beforeAuthMiddleware = (req: NextRequest) => {
	// TODO: Wire up
}

export default authMiddleware({
	publicRoutes: ['/', '/user-intake'],
	afterAuth: async (auth, req, evt) => {
		if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
			if (!auth.userId && !auth.isPublicRoute) {
				return redirectToSignIn({ returnBackUrl: req.url })
			}
		}

		const user = await clerkClient.users.getUser(auth.userId!)

		if (!user.privateMetadata.hasRunIntake) {
			const intakeUrl = new URL('/user-intake', req.url).toString()
			const homeUrl = new URL('/', req.url).toString()

			const currentUrl = new URL(req.url)
			if (currentUrl.pathname !== new URL(intakeUrl).pathname && currentUrl.pathname !== new URL(homeUrl).pathname) {
				return NextResponse.redirect(intakeUrl)
			}
		}
	}
})

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}

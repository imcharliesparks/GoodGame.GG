import { authMiddleware, redirectToSignIn } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

const beforeAuthMiddleware = (req: NextRequest) => {
	// TODO: Wire up
}

export default authMiddleware({
	// TODO: Determine all public routes when we go live
	publicRoutes: ['/'],
	beforeAuth: (req) => {
		// Execute next-intl middleware before Clerk's auth middleware
		return beforeAuthMiddleware(req)
	},
	afterAuth(auth, req, evt) {
		// TODO: Remove before go live
		if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
			if (!auth.userId && !auth.isPublicRoute) {
				return redirectToSignIn({ returnBackUrl: req.url })
			}

			// TODO: Figure out the too many redirects situation here
			// if (auth.userId) {
			// 	const comboBuilder = new URL('/app/combo-builder/SF6/ryu/moves', req.url)
			// 	return NextResponse.redirect(comboBuilder)
			// }
		}
	}
})

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}

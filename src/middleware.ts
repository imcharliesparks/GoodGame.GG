import { authMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export default authMiddleware({
	publicRoutes: ['/', '/auth/sign-in', '/auth/sign-up'],
	afterAuth: (auth, req) => {
		if (process.env.NODE_ENV === 'development') {
			return NextResponse.next()
		}

		if (!auth.userId && !auth.isPublicRoute) {
			const signInUrl = new URL('/auth/sign-in', req.url)
			signInUrl.searchParams.set('redirect_url', req.url)
			return NextResponse.redirect(signInUrl)
		}
	}
})

export const config = { matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'] }

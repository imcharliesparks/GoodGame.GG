import { authMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { BASE_URL } from './shared/constants'
import { APIMethods } from './shared/types'

export default authMiddleware({
	publicRoutes: ['/', '/auth/sign-in', '/auth/sign-up'],
	afterAuth: (auth, req) => {
		const { userId, isPublicRoute } = auth

		if (userId) {
			// CS NOTE: Important to not await here so we don't stall redirect execution
			fetch(`${BASE_URL}/api/users/${userId}/create`, {
				method: APIMethods.POST,
				headers: {
					'Content-Type': 'application/json'
				}
			})
		}

		if (process.env.NODE_ENV === 'development') {
			return NextResponse.next()
		}

		if (!userId && !isPublicRoute) {
			const signInUrl = new URL('/auth/sign-in', req.url)
			signInUrl.searchParams.set('redirect_url', req.url)
			return NextResponse.redirect(signInUrl)
		}
	}
})

export const config = { matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'] }

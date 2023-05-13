import { withClerkMiddleware, getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// SETUP TODO: Update with public paths
const publicPaths = ['/', '/auth/sign-in', '/auth/sign-up']

const isPublic = (path: string) => {
	return publicPaths.includes(path)
}

export default withClerkMiddleware((request: NextRequest) => {
	if (process.env.NODE_ENV === 'development') {
		return NextResponse.next()
	}

	if (isPublic(request.nextUrl.pathname)) {
		return NextResponse.next()
	}

	const { userId } = getAuth(request)

	if (!userId) {
		const signInUrl = new URL('/auth/sign-in', request.url)
		signInUrl.searchParams.set('redirect_url', request.url)
		return NextResponse.redirect(signInUrl)
	}
	return NextResponse.next()
})

export const config = { matcher: '/((?!_next/image|_next/static|favicon.ico|.*.svg).*)' }

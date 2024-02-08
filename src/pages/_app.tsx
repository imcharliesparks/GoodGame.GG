import '@/styles/globals.css'
import { NextPage, NextPageContext } from 'next'
import App, { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import cookie from 'cookie'
import { APIMethods, TypeOfPerson } from '@/shared/types'
import { ClerkProvider } from '@clerk/nextjs'
import ErrorBoundary from '@/components/ErrorBoundary'
// import Layout from '@/components/layout/desktop'
import Layout from '@/components/layout/default'
import { ThemeProvider } from '@material-tailwind/react'

export type NextPageWithLayout<P = Record<string, any>, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
	ctx: NextPageContext
}

// TODO: Also fix this bullshit
function MyApp({ Component, pageProps: { ...pageProps } }: AppPropsWithLayout) {
	const renderWithLayout = Component.getLayout || ((page: ReactNode) => <Layout>{page}</Layout>)
	return (
		<ErrorBoundary>
			<ClerkProvider
				publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
				signInUrl="/sign-in"
				signUpUrl="sign-up"
				{...pageProps}
			>
				<ThemeProvider>{renderWithLayout(<Component {...pageProps} />)}</ThemeProvider>
			</ClerkProvider>
		</ErrorBoundary>
	)
}

// TODO: Figure out how to optimize user agent stuffs for SEO
// // @ts-ignore
// class MyApp extends App<AppPropsWithLayout> {
// 	static async getInitialProps({ Component, ctx }: AppPropsWithLayout) {
// 		let pageProps = {}

// 		if ((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') && ctx.req) {
// 			const cookies = cookie.parse(ctx.req?.headers.cookie || '')

// 			if (!cookies.fbid) {
// 				const ip = ctx.req?.headers['x-forwarded-for'] || ctx.req?.socket.remoteAddress
// 				const userAgent = ctx.req?.headers['user-agent']
// 				const referrer = ctx.req?.headers['referer'] || 'Direct/No Referrer'
// 				const ingestionEngineAPILocation = process.env.USER_INGESTION_API_LOCATION!

// 				const userDataPayload = {
// 					ip,
// 					userAgent,
// 					referrer,
// 					applicationSource: 'GoodGame.GG',
// 					typeOfPerson: TypeOfPerson.VISITOR
// 				}

// 				const request = await fetch(`${ingestionEngineAPILocation}/ingest`, {
// 					method: APIMethods.POST,
// 					headers: {
// 						'Content-Type': 'application/json'
// 					},
// 					body: JSON.stringify(userDataPayload)
// 				})
// 				const response = await request.json()
// 				const { user_id } = response.data

// 				if (!user_id) {
// 					console.error('Unable to grab user ID from ingest service')
// 				} else {
// 					ctx.res?.setHeader(
// 						'Set-Cookie',
// 						cookie.serialize('fbid', JSON.stringify(user_id), {
// 							maxAge: 60 * 60 * 24 * 7 * 4,
// 							path: '/'
// 						})
// 					)
// 				}
// 			}
// 		}

// 		if (Component.getInitialProps) {
// 			pageProps = await Component.getInitialProps(ctx)
// 		}

// 		return { pageProps }
// 	}

// 	render() {
// 		const { Component, pageProps } = this.props
// 		const renderWithLayout = Component.getLayout || ((page: ReactNode) => <Layout>{page}</Layout>)
// 		return (
// 			<ErrorBoundary>
// 				<ClerkProvider
// 					publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
// 					signInUrl="/sign-in"
// 					signUpUrl="sign-up"
// 					{...pageProps}
// 				>
// 					{renderWithLayout(<Component {...pageProps} />)}
// 				</ClerkProvider>
// 			</ErrorBoundary>
// 		)
// 	}
// }

export default MyApp

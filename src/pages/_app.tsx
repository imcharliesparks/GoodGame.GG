import ErrorBoundary from '@/components/ErrorBoundary'
import Layout from '@/components/layout/desktop'
import { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY } from '@/shared/constants'
import '@/styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<P = Record<string, any>, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	// TODO: Add support for mobile vs desktop layouts here
	const renderWithLayout = Component.getLayout || ((page: ReactNode) => <Layout>{page}</Layout>)
	return (
		<ErrorBoundary>
			<ClerkProvider publishableKey={NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} {...pageProps}>
				{renderWithLayout(<Component {...pageProps} />)}
			</ClerkProvider>
		</ErrorBoundary>
	)
}

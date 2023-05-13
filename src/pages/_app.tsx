import ErrorBoundary from '@/components/ErrorBoundary'
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
	// SETUP TODO: Update with layout
	const renderWithLayout = Component.getLayout || ((page: ReactNode) => <>{page}</>)
	return (
		<ErrorBoundary>
			<ClerkProvider {...pageProps}>{renderWithLayout(<Component {...pageProps} />)}</ClerkProvider>
		</ErrorBoundary>
	)
}

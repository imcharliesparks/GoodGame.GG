import React from 'react'
import Footer from './Footer'
import NavHeader from './NavHeader'
import Router from 'next/router'
import LoadingScreen from '../UI-Elements/LoadingScreen'

type Props = {
	children: React.ReactNode
}

// TODO: Do we need any extra metadata here? Does Main need a page id or anything for SEO?
// TODO: Make this mobile safe especially the padding here
const Layout = ({ children }: Props) => {
	const [isLoading, setIsLoading] = React.useState(false)

	React.useEffect(() => {
		const handleStart = (url: string) => url !== Router.asPath && setIsLoading(true)
		const handleComplete = (url: string) => setIsLoading(false)

		Router.events.on('routeChangeStart', handleStart)
		Router.events.on('routeChangeComplete', handleComplete)
		Router.events.on('routeChangeError', handleComplete)

		return () => {
			Router.events.off('routeChangeStart', handleStart)
			Router.events.off('routeChangeComplete', handleComplete)
			Router.events.off('routeChangeError', handleComplete)
		}
	}, [])
	return (
		<>
			<NavHeader />
			{isLoading ? (
				<LoadingScreen />
			) : (
				<main className="max-w-screen-xl mx-auto pb-36 md:pb-24 overflow-y-scroll">{children}</main>
			)}

			<Footer />
		</>
	)
}

export default Layout

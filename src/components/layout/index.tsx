import React from 'react'
import Footer from './Default/Footer'
import NavHeader from './Default/NavHeader'

type Props = {
	children: React.ReactNode
}

// TODO: Do we need any extra metadata here? Does Main need a page id or anything for SEO?
// TODO: Make this mobile safe especially the padding here
const Layout = ({ children }: Props) => (
	<>
		<NavHeader />
		<main className="max-w-screen-xl mx-auto pb-36 md:pb-24 overflow-y-scroll">{children}</main>
		<Footer />
	</>
)

export default Layout

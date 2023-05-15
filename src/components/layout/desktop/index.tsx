import React from 'react'
import Footer from './Footer'
import NavHeader from './NavHeader'

type Props = {
	children: React.ReactNode
}

// TODO: Do we need any extra metadata here? Does Main need a page id or anything for SEO?
const Layout = ({ children }: Props) => (
	<>
		<NavHeader />
		<main>{children}</main>
		<Footer />
	</>
)

export default Layout

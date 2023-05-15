import React from 'react'
import Footer from './Footer'
import NavHeader from './NavHeader'

type Props = {
	children: React.ReactNode
}

const Layout = ({ children }: Props) => (
	<>
		<NavHeader />
		{children}
		<Footer />
	</>
)

export default Layout

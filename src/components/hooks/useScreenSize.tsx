import { useState, useEffect } from 'react'

export type ScreenSize = 'mobile' | 'desktop'

const useScreenSize = (): ScreenSize => {
	const [screenSize, setScreenSize] = useState<ScreenSize>('desktop')

	const updateScreenSize = () => {
		const isMobile = window.innerWidth <= 768
		setScreenSize(isMobile ? 'mobile' : 'desktop')
	}

	useEffect(() => {
		updateScreenSize()
		window.addEventListener('resize', updateScreenSize)
		return () => window.removeEventListener('resize', updateScreenSize)
	}, [])

	return screenSize
}

export default useScreenSize

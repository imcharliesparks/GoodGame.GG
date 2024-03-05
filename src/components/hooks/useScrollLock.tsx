import * as React from 'react'

export const useScrollLock = (shouldLock: boolean = true) => {
	React.useEffect(() => {
		const documentBody = document.body

		if (shouldLock) {
			documentBody.classList.add('no-scroll')
		} else {
			documentBody.classList.remove('no-scroll')
		}

		return () => documentBody.classList.remove('no-scroll')
	}, [shouldLock])
}

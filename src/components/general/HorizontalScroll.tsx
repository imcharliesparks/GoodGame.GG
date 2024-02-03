import React from 'react'
import styles from '../../styles/components/HorizontalScrollStyles.module.css'

type HorizontalScrollProps = {
	children: React.ReactNode
}

const HorizontalScroll = ({ children }: HorizontalScrollProps) => {
	return <div className={`${styles.horizontalScroll}`}>{children}</div>
}

export default HorizontalScroll

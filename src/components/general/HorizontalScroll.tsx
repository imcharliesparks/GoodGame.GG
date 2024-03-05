import React from 'react'
import styles from '../../styles/components/HorizontalScrollStyles.module.css'

type HorizontalScrollProps = {
	children: React.ReactNode
	classes?: string
}

const HorizontalScroll = ({ children, classes }: HorizontalScrollProps) => {
	return <div className={`${styles.horizontalScroll} ${classes}`}>{children}</div>
}

export default HorizontalScroll

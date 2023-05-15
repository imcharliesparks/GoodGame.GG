import React from 'react'
import styles from '../../styles/components/Loading.module.css'
import LoadingSpinner from './LoadingSpinner'

const Loading = () => {
	return (
		<div className={styles.container}>
			<span className={`${styles.text} mb-3 text-white`}>Loading...</span>
			<LoadingSpinner />
		</div>
	)
}

export default Loading

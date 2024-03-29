import React, { useState } from 'react'

// TODO: Make this an MF NPM package!
// TODO: Add an animation here
interface HeartIconProps {
	borderColor?: string
	fillColor?: string
	width?: string
	height?: string
	className?: string
}

const HeartIcon: React.FC<HeartIconProps> = ({
	borderColor = 'black',
	fillColor = 'red',
	width = '30',
	height = '30',
	className
}) => {
	const [filled, setFilled] = useState(false)

	return (
		<div className="absolute top-3 right-3">
			<svg
				onClick={() => setFilled(!filled)}
				xmlns="http://www.w3.org/2000/svg"
				width={width}
				height={height}
				viewBox="0 0 24 24"
				fill={filled ? fillColor : 'none'}
				stroke={borderColor}
				strokeWidth="1"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={`${className ? className : ''}`}
			>
				<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
			</svg>
		</div>
	)
}

export default HeartIcon

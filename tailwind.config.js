/** @type {import('tailwindcss').Config} */
import { screenSizeBreakpoints } from './src/shared/constants'
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/react-tailwindcss-select/dist/index.esm.js'
	],
	theme: {
		screens: {
			...screenSizeBreakpoints
		},
		fontFamily: {
			nunito: ['"Nunito", sans-serif']
		},
		extend: {
			zIndex: {
				1: '1',
				2: '2',
				3: '3',
				999: '999'
			},
			colors: {
				// SETUP TODO: Add colors for app here
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		// SETUP TODO: Set true if you want dark mode support
		themes: false
	}
}

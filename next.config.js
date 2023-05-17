/** @type {import('next').NextConfig} */

// SETUP TODO: Enable PWA support if desired
const withPWA = require('next-pwa')({
	dest: 'public'
})

const defaultExports = {
	reactStrictMode: true,
	swcMinify: true,
	eslint: {
		ignoreDuringBuilds: true
	},
	images: {
		domains: ['images.igdb.com'],
	},
}

const pwaExports = withPWA({
	...defaultExports,
	pwa: {
		dest: 'public',
		register: true,
		disable: process.env.NODE_ENV === 'development',
		skipWaiting: true
	}
})

module.exports = defaultExports

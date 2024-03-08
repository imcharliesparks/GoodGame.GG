import LoadingSpinner from '../general/LoadingSpinner'

// TODO: Make a sweet loading icon/screen
const LoadingScreen = () => (
	<div className="fixed top-0 left-0 w-full h-full z-50 bg-white flex justify-center items-center">
		<LoadingSpinner />
		<p>Loading...</p>
	</div>
)

export default LoadingScreen

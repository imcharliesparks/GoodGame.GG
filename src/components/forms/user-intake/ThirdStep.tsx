import React from 'react'

type ThirdStepProps = {
	nextStep: () => void
	previousStep: () => void
}

const ThirdStep = ({ nextStep }: ThirdStepProps) => {
	return (
		<div>
			<div className="text-center my-10">
				<p className="text-3xl">Let's get your information</p>
			</div>
			<div className="flex justify-center">
				<button
					onClick={() => nextStep()}
					className={`cursor-pointer bg-blue-600 px-6 py-2.5 rounded-full text-white baseline hover:bg-blue-300 transition-colors text-center`}
				>
					Let&apos;s start!
				</button>
				<p className="mt-[9px] ml-[20px]">
					press
					<strong> Enter ↵</strong>
				</p>
			</div>
		</div>
	)
}

export default ThirdStep

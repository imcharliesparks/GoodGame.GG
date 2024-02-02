import React from 'react'
import Image from 'next/image'

type LandingStepProps = {
	nextStep: () => void
	previousStep: () => void
}

const LandingStep = ({ nextStep }: LandingStepProps) => {
	return (
		<div>
			<Image
				className="mx-auto"
				priority={true}
				alt="Our stock image"
				width={332}
				height={309.95}
				src={require('../../../../resources/Intake-Form-Image.svg')}
			/>
			<div className="text-center my-10">
				<p className="text-3xl">Let's finish signing you up!</p>
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

export default LandingStep

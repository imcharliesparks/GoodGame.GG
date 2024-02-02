import React from 'react'

type LastNameStepProps = {
	nextStep: () => void
	previousStep: () => void
	handleChange: (key: string, value: string) => void
}

const LastNameStep = ({ nextStep, handleChange }: LastNameStepProps) => {
	return (
		<div className="mt-24">
			<div className="text-left container w-96">
				<div className="flex align-center">
					<p className="text-xl">
						2. What about your <strong>last name</strong>?
					</p>
				</div>
			</div>
			<input
				onChange={(e: any) => handleChange('lastName', e.target.value)}
				placeholder="Enter your last name"
				className="block w-full my-4 font-inherit text-[#347182] p-0 border-0 outline-none rounded-none appearance-none bg-none bg-pos-0 bg-repeat bg-attachment-scroll bg-image-none bg-size-auto bg-origin-padding bg-clip-border transform-gpu text-2xl leading-none  bg-transparent shadow-[0_1px_rgba(52,113,130,0.3)]"
			/>
			<div className="flex justify-start">
				<button
					onClick={() => nextStep()}
					className={`cursor-pointer bg-blue-600 px-6 py-2.5  rounded-md text-white baseline hover:bg-blue-300 transition-colors text-center`}
				>
					Continue
				</button>
				<p className="mt-[9px] ml-[20px]">
					press
					<strong> Enter ↵</strong>
				</p>
			</div>
		</div>
	)
}

export default LastNameStep

// @ts-nocheck
import React from 'react'
import LandingStep from '@/components/forms/user-intake/LandingStep'
import FirstNameStep from '@/components/forms/user-intake/FirstNameStep'
import ThirdStep from '@/components/forms/user-intake/ThirdStep'
import LastNameStep from '@/components/forms/user-intake/LastNameStep'

enum FormStep {
	LANDING,
	BASIC_INFO,
	ADDITIONAL_INFO
}

export type UserFormInputState = {
	firstName: string
	lastName: string
	gametag?: string
}

// TODO: Wire up enter pushing
// TODO: Add back buttons of some kind
// TODO: Update the user data payload in the ingest service when completed
const UserIntakePage = () => {
	const [formState, setFormState] = React.useState<UserFormInputState>({})
	const [currentFormStep, setCurrentFormStep] = React.useState<FormStep>(FormStep.LANDING)
	const handleSubmitInfo = async () => {
		// Submit info to my API endpoint
	}

	const updateFormState = (key: string, value: string) => {
		setFormState((prev: UserFormInputState) => ({ ...userFormInputState, [key]: value }))
	}

	return (
		<section className="md:pb-24 py-16 overflow-x-hidden xs:text-center md:text-left h-[100%] flex content-center flex-col">
			<h1>todo: replace this with the stepper from Material</h1>
			{/* <Stepper /> */}
			{/* <StepWizard className="container flex flex-col justify-center mx-auto">
				<LandingStep />
				<FirstNameStep />
				<LastNameStep />
				<ThirdStep />
			</StepWizard> */}
		</section>
	)
}

export default UserIntakePage

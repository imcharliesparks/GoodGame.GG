import React from 'react'
import { SignUp } from '@clerk/nextjs'

// TODO: Update redirect to app landing if auth'd
const SignUpPage = () => (
	<div className="h-[80vh] w-[100vw] flex justify-center items-center">
		<SignUp path="/auth/sign-up" routing="hash" signInUrl="/auth/sign-in" redirectUrl="/app/search/games" />
	</div>
)

export default SignUpPage

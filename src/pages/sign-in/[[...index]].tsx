import React from 'react'
import { SignIn } from '@clerk/nextjs'

// TODO: Update redirect to app landing if auth'd
const SignInPage = () => (
	<div className="h-[80vh] w-full flex justify-center items-center">
		<SignIn path="/sign-in" routing="path" signUpUrl="sign-up" redirectUrl="/app/search/games" />
	</div>
)

export default SignInPage

import React from 'react'
import { SignIn } from '@clerk/nextjs'

// TODO: Update redirect to app landing if auth'd
const SignInPage = () => (
	<div className="h-[100vh] w-[100vw] flex justify-center items-center">
		<SignIn path="/auth/sign-in" routing="path" signUpUrl="/auth/sign-up" redirectUrl="/app/search-games" />
	</div>
)

SignInPage.getLayout = (page: React.ReactChild) => <>{page}</>

export default SignInPage

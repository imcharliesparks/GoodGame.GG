import { APIMethods, APIStatuses, DocumentResponses, GeneralAPIResponses } from '@/shared/types'
import { withAuth } from '@clerk/nextjs/dist/api'
import { NextRequest, NextResponse } from 'next/server'
import { getFirestore } from 'firebase/firestore'
import { firebaseDB } from '@/lib/firebase'

export const handler = withAuth(async (req, res) => {
	const { method } = req

	if (method === APIMethods.GET) {
		try {
			const db = getFirestore(firebaseDB)
			const request = await fetch('https://api.igdb.com/v4/games/')
			const response = await request.json()
			console.log('response.data', response.data)
			res.status(200).json({
				status: APIStatuses.SUCCESS,
				type: DocumentResponses.DATA_FOUND,
				data: response.data
			})
		} catch (error) {}
	} else {
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
})

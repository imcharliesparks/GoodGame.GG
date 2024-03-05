import { useUserListsStore } from '@/state/userListsState'
import { useAuth } from '@clerk/nextjs'
import React from 'react'

// TODO: Fix this so that user ingestion engine works
const useInitApplication = () => {
	// 		if ((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') && ctx.req) {
	// 			const cookies = cookie.parse(ctx.req?.headers.cookie || '')
	// 			if (!cookies.fbid) {
	// 				const ip = ctx.req?.headers['x-forwarded-for'] || ctx.req?.socket.remoteAddress
	// 				const userAgent = ctx.req?.headers['user-agent']
	// 				const referrer = ctx.req?.headers['referer'] || 'Direct/No Referrer'
	// 				const ingestionEngineAPILocation = process.env.USER_INGESTION_API_LOCATION!
	// 				const userDataPayload = {
	// 					ip,
	// 					userAgent,
	// 					referrer,
	// 					applicationSource: 'GoodGame.GG',
	// 					typeOfPerson: TypeOfPerson.VISITOR
	// 				}
	// 				const request = await fetch(`${ingestionEngineAPILocation}/ingest`, {
	// 					method: APIMethods.POST,
	// 					headers: {
	// 						'Content-Type': 'application/json'
	// 					},
	// 					body: JSON.stringify(userDataPayload)
	// 				})
	// 				const response = await request.json()
	// 				const { user_id } = response.data
	// 				if (!user_id) {
	// 					console.error('Unable to grab user ID from ingest service')
	// 				} else {
	// 					ctx.res?.setHeader(
	// 						'Set-Cookie',
	// 						cookie.serialize('fbid', JSON.stringify(user_id), {
	// 							maxAge: 60 * 60 * 24 * 7 * 4,
	// 							path: '/'
	// 						})
	// 					)
	// 				}
	// 			}
	// 		}
}

export default useInitApplication

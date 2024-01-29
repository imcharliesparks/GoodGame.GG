import { APIMethods, APIStatuses, DocumentResponses, GeneralAPIResponses } from '@/shared/types'
import { clerkClient } from '@clerk/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	if (method === APIMethods.GET) {
		try {
			const allUsers = await clerkClient.users.getUserList()

			if (allUsers.length) {
				res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_FOUND,
					data: { users: allUsers }
				})
			} else {
				return res
					.status(404)
					.json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.FAILURE, data: { error: 'No users found' } })
			}
		} catch (error) {
			console.error(`Error getting all users`, error)
			return res
				.status(404)
				.json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.FAILURE, data: { error: 'Error getting all users' } })
		}
	} else {
		console.error('Invalid request to search-games')
		return res.status(400).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

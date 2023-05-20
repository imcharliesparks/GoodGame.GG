import { APIMethods, APIStatuses, GeneralAPIResponses } from '@/shared/types'
import { NextApiRequest, NextApiResponse } from 'next'

// TODO: Do I need with auth here?
const handler = (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body } = req
	console.log('webhook body', body)
	if (method === APIMethods.GET) {
		try {
		} catch (error) {
			console.error(error)
			return res.status(400).json({
				status: APIStatuses.ERROR,
				type: GeneralAPIResponses.FAILURE,
				data: { error: 'Unable to create user.' }
			})
		}
	} else {
		console.error('Invalid request to create user endpoint.')
		return res.status(404).json({ status: APIStatuses.ERROR, type: GeneralAPIResponses.INVALID_REQUEST_TYPE })
	}
}

export default handler

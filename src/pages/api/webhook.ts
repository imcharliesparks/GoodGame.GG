import { requireAuth, withAuth } from '@clerk/nextjs/dist/api'
import type { WebhookEvent } from '@clerk/nextjs/server'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = requireAuth(async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		// The payload of the webhook is stored in req.body
		const payload = req.body as WebhookEvent

		// You can now do something with the payload
		console.log(payload)

		// After processing the webhook, send a 200 response to acknowledge receipt
		res.status(200).json({ received: true })
	} else {
		res.status(405).send('Method Not Allowed')
	}
})

export default handler

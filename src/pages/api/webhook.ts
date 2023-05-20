export default async function handler(req, res) {
	if (req.method === 'POST') {
		// The payload of the webhook is stored in req.body
		const payload = req.body

		// You can now do something with the payload
		console.log(payload)

		// After processing the webhook, send a 200 response to acknowledge receipt
		res.status(200).json({ received: true })
	} else {
		res.status(405).send('Method Not Allowed')
	}
}

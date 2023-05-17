import { APIMethods, APIStatuses, DocumentResponses, GeneralAPIResponses, UserByEmail } from '@/shared/types'
import { handleEmailFuzzySearch } from '@/shared/utils'
import { User, clerkClient, withAuth } from '@clerk/nextjs/dist/api'

// TODO: Expand to handle all email-based user queries based on method type
const handler = withAuth(async (req, res) => {
	const { method } = req
	const email = req.query.email as string

	if (method === APIMethods.GET) {
		try {
			const allUsers: User[] = await clerkClient.users.getUserList()
			const userEmails: UserByEmail[] = allUsers.map((user: User) => ({
				id: user.id,
				// TODO: Add support for multiple emails prob?
				email: user.emailAddresses[0].emailAddress
			}))
			const matchedEmails = handleEmailFuzzySearch(email, userEmails)
			const foundUsersByEmail: User[] = allUsers.filter((user: User) => matchedEmails.includes(user.id))

			if (allUsers.length) {
				res.status(200).json({
					status: APIStatuses.SUCCESS,
					type: DocumentResponses.DATA_FOUND,
					data: { users: foundUsersByEmail }
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
})

export default handler

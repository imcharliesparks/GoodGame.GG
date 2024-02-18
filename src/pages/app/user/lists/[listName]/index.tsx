import RemoveFromListDialog from '@/components/Dialogs/RemoveFromListDialog'
import UpdateGameBottomDrawer from '@/components/Drawers/BottomDrawer/UpdateGameBottomDrawer'
import NewGameCard from '@/components/Games/NewGameCard'
import {
	useCurrentlySelectedGame,
	useCurrentlySelectedList,
	useGamesOnCurrentList,
	useUserListsState
} from '@/components/hooks/useStateHooks'
import firebase_app from '@/lib/firebase'
import { CollectionNames, GGLists, StoredGame } from '@/shared/types'
import { convertFirebaseTimestamps } from '@/shared/utils'
import { getAuth } from '@clerk/nextjs/server'
import { Typography } from '@material-tailwind/react'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import React from 'react'

type IndividualListPageProps = {
	foundGames: StoredGame[]
	lists: GGLists
	listName: string
	error?: string
}

// TODO: Add sorting
const IndividualListPage = ({ foundGames, lists, listName, error }: IndividualListPageProps) => {
	const [currentlySelectedGame] = useCurrentlySelectedGame()
	const [showRemoveFromListDialog, setShowRemoveFromListDialog] = React.useState<boolean>(false)
	const [showUpdateGameDialog, setShowUpdateGameDialog] = React.useState<boolean>(false)
	// const [isLoading, setIsLoading] = React.useState<boolean>(false)
	// TODO: Think of a better way to not have to re set this in multiple places (we should probably pull it super early and then persist it)
	const [_userLists, setUserLists] = useUserListsState()
	const [_, setCurrentlySelectedList] = useCurrentlySelectedList()
	const games = useGamesOnCurrentList()()

	React.useEffect(() => {
		setCurrentlySelectedList(listName)
		setUserLists(lists)
	}, [])

	const toggleRemoveFromListDialog = (isOpen?: boolean) =>
		setShowRemoveFromListDialog(isOpen ?? !showRemoveFromListDialog)

	const toggleUpdateGameDialog = (isOpen?: boolean) => setShowUpdateGameDialog(isOpen ?? !showUpdateGameDialog)

	return (
		<section className="w-full">
			<Typography variant="h3" className="mx-auto text-center my-4">
				{listName}
			</Typography>
			<div className="flex justify-center sm:hidden">
				<div className="grid grid-cols-1 gap-4 max-w-screen-lg">
					{games.map(
						(game: StoredGame) =>
							typeof game !== 'string' && (
								<NewGameCard
									gameFromList={game}
									key={game.game_id}
									toggleRemoveFromListDialog={toggleRemoveFromListDialog}
									toggleUpdateGameDialog={toggleUpdateGameDialog}
								/>
							)
					)}
				</div>
			</div>
			<div className="hidden sm:flex md:hidden justify-center">
				<div className="grid grid-cols-2 gap-4 max-w-screen-lg">
					{games.map(
						(game: StoredGame) =>
							typeof game !== 'string' && (
								<NewGameCard
									gameFromList={game}
									key={game.game_id}
									toggleRemoveFromListDialog={toggleRemoveFromListDialog}
									toggleUpdateGameDialog={toggleUpdateGameDialog}
								/>
							)
					)}
				</div>
			</div>
			<div className="md:flex justify-center hidden lg:hidden">
				<div className="grid grid-cols-3 gap-6 max-w-screen-lg">
					{games.map(
						(game: StoredGame) =>
							typeof game !== 'string' && (
								<NewGameCard
									gameFromList={game}
									key={game.game_id}
									toggleRemoveFromListDialog={toggleRemoveFromListDialog}
									toggleUpdateGameDialog={toggleUpdateGameDialog}
									classes="flex-shrink-0"
								/>
							)
					)}
				</div>
			</div>
			<div className="lg:flex justify-center hidden">
				<div className="grid grid-cols-4 gap-6 max-w-screen-lg">
					{games.map(
						(game: StoredGame) =>
							typeof game !== 'string' && (
								<NewGameCard
									gameFromList={game}
									key={game.game_id}
									toggleRemoveFromListDialog={toggleRemoveFromListDialog}
									toggleUpdateGameDialog={toggleUpdateGameDialog}
									classes="flex-shrink-0"
								/>
							)
					)}
				</div>
			</div>
			{currentlySelectedGame && (
				<>
					<RemoveFromListDialog isOpen={showRemoveFromListDialog} setIsDialogOpen={toggleRemoveFromListDialog} />
					<UpdateGameBottomDrawer open={showUpdateGameDialog} close={toggleUpdateGameDialog} />
				</>
			)}
		</section>
	)
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { query: urlParameter } = ctx
	const { userId } = getAuth(ctx.req)
	const listName = urlParameter.listName as string
	const props: IndividualListPageProps = {
		foundGames: [],
		listName: '',
		lists: {}
	}

	if (!listName) {
		return {
			props: {
				...props,
				error: 'No list provided to query!'
			}
		}
	} else if (!userId) {
		return {
			props: {
				...props,
				error: 'User is not authd!'
			}
		}
	}

	props.listName = listName

	try {
		// garf add lists with ownership here
		const db = getFirestore(firebase_app)
		const userCollectionRef = collection(db, CollectionNames.USERS)
		const q = query(userCollectionRef, where('clerkId', '==', userId))
		const querySnapshot = await getDocs(q)
		if (querySnapshot.empty) {
			console.error('Non logged in user accessing search')
		} else {
			const { lists } = Object.assign(querySnapshot.docs[0].data(), {})

			for (const listName in lists) {
				convertFirebaseTimestamps(lists[listName])
			}

			if (lists[listName]) {
				const foundGames: StoredGame[] = []

				for (let game_id in lists[listName]) {
					foundGames.push(lists[listName][game_id])
				}

				props.foundGames = foundGames
				props.lists = lists
			} else {
				props.error = `The user does not have a list called ${listName}`
			}
		}
	} catch (error) {
		console.error('there was an error fetching initial data on the search/games page', error)
		props.error = 'There was an error fetching the games!'
	} finally {
		return {
			props: {
				...props
			}
		}
	}
}

export default IndividualListPage

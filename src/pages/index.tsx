import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { useClerk } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	const { signOut } = useClerk()

	return (
		<div
			className={`flex min-h-screen w-[100vw] flex-col items-center md:justify-between p-10 md:p-24  ${inter.className}`}
		>
			<div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
				<div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none">
					<Link
						className="flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
						href="https://sparksfullstack.io"
						target="_blank"
						rel="noopener noreferrer"
					>
						By{' '}
						<Image src="/resources/sfs-logo-full.svg" alt="The Sparks Full-Stack logo" width={290} height={72.5} priority />
					</Link>
				</div>
			</div>

			<Link href="https://sparksfullstack.io" target="_blank" rel="noopener noreferrer">
				<div>
					<Image src="/resources/sfs-icon.svg" alt="The Sparks Full-Stack logo" width={180} height={37} priority />
				</div>
			</Link>

			<div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
				<Link
					href="/app/search-games"
					className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
				>
					<h2 className={`mb-3 text-2xl font-semibold`}>
						Search Games{' '}
						<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
							-&gt;
						</span>
					</h2>
					<p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Search and Add Games to Your Collection</p>
				</Link>

				<Link
					href="/app/my-collection"
					className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
				>
					<h2 className={`mb-3 text-2xl font-semibold`}>
						View Collection{' '}
						<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
							-&gt;
						</span>
					</h2>
					<p className={`m-0 max-w-[30ch] text-sm opacity-50`}>View Your Games Collection</p>
				</Link>

				<Link
					href="/auth/sign-in"
					className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
				>
					<h2 className={`mb-3 text-2xl font-semibold`}>
						Get Auth'd{' '}
						<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
							-&gt;
						</span>
					</h2>
					<p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Sign In/Up with Clerk</p>
				</Link>
				<button
					onClick={() => signOut}
					className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
				>
					<h2 className={`mb-3 text-2xl font-semibold`}>
						Sign out{' '}
						<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
							-&gt;
						</span>
					</h2>
					<p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Sign Out with Clerk</p>
				</button>
			</div>
		</div>
	)
}

Home.getLayout = (page: React.ReactChild) => <>{page}</>

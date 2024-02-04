import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type ModalProps = ComponentPropsWithoutRef<'dialog'> & {
	onClose: () => void
}

export default function BaseModal({ children, open, onClose, className, ...rest }: ModalProps) {
	const ref = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		const dialog = ref.current!
		if (open) {
			dialog.showModal()
			dialog.dataset.open = ''
		} else {
			delete dialog.dataset.open
			const handler = () => dialog.close()
			const inner = dialog.children[0] as HTMLElement
			inner.addEventListener('transitionend', handler)
			return () => inner.removeEventListener('transitionend', handler)
		}
	}, [open])

	useEffect(() => {
		const dialog = ref.current!
		const handler = (e: Event) => {
			e.preventDefault()
			onClose()
		}
		dialog.addEventListener('close', handler)
		dialog.addEventListener('cancel', handler)
		return () => {
			dialog.removeEventListener('close', handler)
			dialog.removeEventListener('cancel', handler)
		}
	}, [onClose])

	return (
		<dialog ref={ref} className={twMerge('group', 'bg-transparent', className)} {...rest}>
			<div className="fixed inset-0 grid place-content-center bg-black/75 opacity-0 transition-all group-data-[open]:opacity-100">
				<div className="m-2 w-full max-w-lg scale-75 bg-white p-4 opacity-0 shadow-lg transition-all group-data-[open]:scale-100 group-data-[open]:opacity-100">
					{children}
				</div>
			</div>
		</dialog>
	)
}

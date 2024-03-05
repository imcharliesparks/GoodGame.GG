import { DialogNames } from '@/shared/types'
import { UIEventsState, useUIEventsStore } from '@/state/uiEventsState'
import { useShallow } from 'zustand/react/shallow'

export const useActiveDialogNames = (): Set<DialogNames> =>
	useUIEventsStore(useShallow((state: UIEventsState) => state.activeDialogs))

export const useIsDialogActive = (dialogName: DialogNames): boolean =>
	useUIEventsStore(useShallow((state: UIEventsState) => state.checkIfDialogIsActive(dialogName)))

export const useRemoveActiveDialog = (): ((dialogName: DialogNames) => void) =>
	useUIEventsStore(useShallow((state: UIEventsState) => state.removeActiveDialog))

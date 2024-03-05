import { DialogNames } from '@/shared/types'
import { create } from 'zustand'

export interface UIEventsState {
	activeDialogs: Set<DialogNames>
	setActiveDialog: (dialogName: DialogNames) => void
	removeActiveDialog: (dialogName: DialogNames) => void
	clearAllDialogs: () => void
}

export const useUIEventsStore = create<UIEventsState>((set, get) => ({
	activeDialogs: new Set<DialogNames>(),
	setActiveDialog: (dialogName: DialogNames) => {
		const newActiveDialogs = get().activeDialogs
		newActiveDialogs.add(dialogName)
		set({ activeDialogs: newActiveDialogs })
		return
	},
	removeActiveDialog: (dialogName: DialogNames) => {
		const newActiveDialogs = get().activeDialogs
		newActiveDialogs.delete(dialogName)
		set({ activeDialogs: newActiveDialogs })
		return
	},
	clearAllDialogs: () => {
		set({ activeDialogs: new Set<DialogNames>() })
	}
}))

import { DialogNames } from '@/shared/types'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import { create } from 'zustand'

export interface UIEventsState {
	activeDialogs: Set<DialogNames>
	isDialogIsActive: (dialogName: DialogNames) => boolean
	setActiveDialog: (dialogName: DialogNames) => void
	removeActiveDialog: (dialogName: DialogNames) => void
	clearAllDialogs: () => void
}

export const useUIEventsStore = create<UIEventsState>((set, get) => ({
	activeDialogs: new Set<DialogNames>(),
	isDialogIsActive: (dialogName: DialogNames) => {
		const currentActiveDialogs = get().activeDialogs
		return currentActiveDialogs.has(dialogName)
	},
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

if (process.env.NODE_ENV === 'development') {
	mountStoreDevtool('UIEventsStore', useUIEventsStore)
}

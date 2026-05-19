'use client'

import { create } from 'zustand'

interface LayoutState {
  /** Off-canvas sidebar visibility on small viewports. */
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
  toggleMobileSidebar: () => void
}

/**
 * Shared layout chrome state. The Header opens the off-canvas sidebar,
 * the Sidebar reads/closes it. Lives in zustand so the two siblings
 * don't need a context provider.
 */
export const useLayoutStore = create<LayoutState>((set) => ({
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleMobileSidebar: () => set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
}))

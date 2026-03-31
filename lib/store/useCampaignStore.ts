'use client'

import { create } from 'zustand'
import type { Campaign, CampaignStatus } from '@/lib/types/campaign'

interface CampaignState {
  /** Currently selected status filter */
  statusFilter: CampaignStatus | 'all'
  /** Currently selected channel filter */
  channelFilter: string
  /** Current page number (1-indexed) */
  currentPage: number
  /** Cached campaigns list (populated by TanStack Query, exposed here for cross-component use) */
  campaigns: Campaign[]
  setStatusFilter: (status: CampaignStatus | 'all') => void
  setChannelFilter: (channel: string) => void
  setCurrentPage: (page: number) => void
  setCampaigns: (campaigns: Campaign[]) => void
  resetFilters: () => void
}

/**
 * Global Zustand store for campaign list UI state.
 */
export const useCampaignStore = create<CampaignState>()((set) => ({
  statusFilter: 'all',
  channelFilter: 'all',
  currentPage: 1,
  campaigns: [],

  setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }),
  setChannelFilter: (channel) => set({ channelFilter: channel, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setCampaigns: (campaigns) => set({ campaigns }),
  resetFilters: () => set({ statusFilter: 'all', channelFilter: 'all', currentPage: 1 }),
}))

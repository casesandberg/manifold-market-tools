'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { useData } from './DataProvider'

function SyncMarketNotification() {
  return (
    <div className="pointer-events-none sticky bottom-4 left-4">
      <div className="pointer-events-auto ml-4 inline-flex divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="flex flex-1 items-center gap-2 p-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 animate-spin text-emerald-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500">Syncing markets</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { isSyncing } = useData()

  return (
    <div className="h-full">
      <motion.header layoutScroll className="contents">
        <Header />
      </motion.header>
      <div className="relative mx-auto flex h-full max-w-screen-2xl flex-col px-4 pt-14 sm:px-6 lg:px-8">
        <main className="flex-auto">{children}</main>
        {/* <Footer /> */}
      </div>

      {isSyncing && <SyncMarketNotification />}
    </div>
  )
}

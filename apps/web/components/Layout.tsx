'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/Header'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <motion.header layoutScroll className="contents">
        <Header />
      </motion.header>
      <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
        <main className="flex-auto">{children}</main>
        {/* <Footer /> */}
      </div>
    </div>
  )
}

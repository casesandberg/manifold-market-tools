'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion } from 'framer-motion'

import { Logo } from '@/components/Logo'
import { MobileSearch, Search } from '@/components/Search'
import { usePathname } from 'next/navigation'

function TopLevelNavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <li>
      <Link
        href={href}
        className={clsx(
          'text-sm leading-5 text-zinc-600 transition hover:text-zinc-900',
          pathname === href && 'font-semibold text-zinc-900',
        )}
      >
        {children}
      </Link>
    </li>
  )
}

export const Header = forwardRef<React.ElementRef<'div'>, { className?: string }>(function Header({ className }, ref) {
  return (
    <motion.div
      ref={ref}
      className={clsx(
        className,
        'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 bg-white px-4 transition sm:px-6',
      )}
    >
      <div className="flex items-center gap-5">
        <Link href="/" aria-label="Home">
          <Logo className="h-6" />
        </Link>

        <nav>
          <ul role="list" className="flex items-center gap-8">
            <TopLevelNavItem href="/">Dashboard</TopLevelNavItem>
            <TopLevelNavItem href="/markets">Markets</TopLevelNavItem>
          </ul>
        </nav>
      </div>

      <div>
        <Search />
        <MobileSearch />
      </div>
    </motion.div>
  )
})

'use client'

import { db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import _ from 'lodash'
import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'

function RelativeTime({ value }: { value: string }) {
  const [_, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return timeSince(new Date(value))
}

function timeSince(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  let interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + 'y'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + 'm'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + 'd'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + 'h'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + 'm'
  }
  return Math.floor(seconds) + 's'
}

export function RecentlyResolvedList() {
  const markets = useLiveQuery(() => db.markets.toArray()) ?? []

  const recentlyResolvedMarkets = useMemo(
    () => _(markets).filter('resolved_at').orderBy('resolved_at').reverse().take(7).value(),
    [markets],
  )

  return (
    <ul role="list" className="space-y-6">
      {recentlyResolvedMarkets.map((market, i) => (
        <li key={market.market_id} className="relative flex gap-x-3">
          <div
            className={clsx(
              i === recentlyResolvedMarkets.length - 1 ? 'h-6' : '-bottom-6',
              'absolute left-0 top-0 flex w-2 justify-center',
            )}
          >
            <div className="w-px bg-gray-300" />
          </div>

          <div className="relative flex h-6 w-2 flex-none items-center justify-center bg-[#F1F1F2]">
            <div className="h-1.5 w-1.5 bg-emerald-400 ring-1 ring-emerald-400" />
          </div>
          <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
            <a
              href={market.resolver_profile_url ?? ''}
              target="_blank"
              className="font-medium text-gray-900 hover:underline"
            >
              {market.resolver_username}
            </a>{' '}
            resolved{' '}
            <a href={market.url ?? ''} className="font-medium text-gray-900 hover:underline">
              {market.market_title}
            </a>{' '}
            as <span className="font-medium text-gray-900">{market.resolution}</span>
          </p>
          <time dateTime={market.resolved_at ?? undefined} className="flex-none py-0.5 text-xs leading-5 text-gray-400">
            <RelativeTime value={market.resolved_at ?? ''} />
          </time>
        </li>
      ))}
    </ul>
  )
}

'use client'

import { Market, db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import _ from 'lodash'
import clsx from 'clsx'
import moment from 'moment'

export function RecentlyResolvedList() {
  const markets = useLiveQuery(() => db.markets.toArray()) ?? []

  const recentlyResolvedMarkets = _(markets).filter('resolved_at').orderBy('resolved_at').reverse().take(7).value()

  return (
    <ul role="list" className="space-y-6">
      {recentlyResolvedMarkets.map((market, i) => (
        <li key={market.market_id} className="relative flex gap-x-4">
          <div
            className={clsx(
              i === recentlyResolvedMarkets.length - 1 ? 'h-6' : '-bottom-6',
              'absolute left-0 top-0 flex w-6 justify-center',
            )}
          >
            <div className="w-px bg-gray-300" />
          </div>

          <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-[#F1F1F2]">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-emerald-400" />
          </div>
          <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
            <span className="font-medium text-gray-900">{market.resolver_username}</span> resolved{' '}
            <span className="font-medium text-gray-900">{market.market_title}</span> as{' '}
            <span className="font-medium text-gray-900">{market.resolution}</span>
          </p>
          <time dateTime={market.resolved_at ?? undefined} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
            {moment(market.resolved_at).fromNow(true)}
          </time>
        </li>
      ))}
    </ul>
  )
}

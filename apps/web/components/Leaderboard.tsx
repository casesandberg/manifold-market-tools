'use client'

import { Market, db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import clsx from 'clsx'

function countResolvedMarkets(markets: Array<Market>, mod: boolean = false) {
  const resolverCounts: Record<string, { count: 0 } & Market> = {}

  markets.forEach((market) => {
    const username = _.get(market, 'resolver_username')
    if (username && (mod ? market.creator_username !== username : market.creator_username === username)) {
      if (!resolverCounts[username]) {
        // Initialize an object for this resolver if it doesn't exist
        resolverCounts[username] = { count: 0, ...market }
      }
      // Increment the count for this resolver
      resolverCounts[username].count++
    }
  })

  return _(resolverCounts).values().orderBy('count').reverse().value()
}

export function Leaderboard() {
  const markets = useLiveQuery(() => db.markets.toArray()) ?? []
  const creatorMarketCounts = useMemo(() => _.take(countResolvedMarkets(markets), 15), [markets])
  const modMarketCounts = useMemo(() => _.take(countResolvedMarkets(markets, true), 15), [markets])
  const [current, setCurrent] = useState('creator')

  const marketsWithCounts = current === 'creator' ? creatorMarketCounts : modMarketCounts

  return (
    <>
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button
            onClick={() => setCurrent('creator')}
            className={clsx(
              current === 'creator'
                ? 'border-emerald-400 text-emerald-500'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium',
            )}
          >
            Creator Resolved
          </button>
          <button
            onClick={() => setCurrent('mod')}
            className={clsx(
              current === 'mod'
                ? 'border-emerald-400 text-emerald-500'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium',
            )}
          >
            Mod Resolved
          </button>
        </nav>
      </div>

      <ul role="list" className="divide-y divide-gray-100">
        {marketsWithCounts.map((market) => (
          <li key={market.resolver_user_id} className="flex justify-between gap-x-6 py-2">
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-10 w-10 flex-none rounded-full bg-gray-50"
                src={market.resolver_avatar_url ?? ''}
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">{market.resolver_username}</p>
                <p className="truncate text-xs leading-5 text-gray-500">Resolved {market.count} markets</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

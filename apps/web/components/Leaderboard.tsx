'use client'

import { Market, db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import _ from 'lodash'

function countResolvedMarkets(markets: Array<Market>) {
  const resolverCounts: Record<string, { count: 0 } & Market> = {}

  markets.forEach((market) => {
    const username = _.get(market, 'resolver_username')
    if (username) {
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

  const marketsWithCounts = _.take(countResolvedMarkets(markets), 10)

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {marketsWithCounts.map((market) => (
        <li key={market.resolver_user_id} className="flex justify-between gap-x-6 py-2">
          <div className="flex min-w-0 gap-x-4">
            <img className="h-10 w-10 flex-none rounded-full bg-gray-50" src={market.resolver_avatar_url} alt="" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{market.resolver_username}</p>
              <p className="truncate text-xs leading-5 text-gray-500">Resolved {market.count} markets</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

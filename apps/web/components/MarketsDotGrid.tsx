'use client'

import { db, isResolvedMarket } from '@/lib/db'
import clsx from 'clsx'
import { useLiveQuery } from 'dexie-react-hooks'

export function MarketsDotGrid() {
  const markets = useLiveQuery(() => db.markets.toArray())

  return (
    <div className="flex flex-wrap gap-1">
      {markets?.map((market) => {
        return (
          <div
            key={market.market_id}
            className={clsx('size-2', isResolvedMarket(market) ? 'bg-[green]' : 'bg-[red]')}
          />
        )
      })}
    </div>
  )
}

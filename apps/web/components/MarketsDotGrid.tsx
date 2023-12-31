'use client'

import { db, isResolvedMarket } from '@/lib/db'
import clsx from 'clsx'
import { useLiveQuery } from 'dexie-react-hooks'

export function MarketsDotGrid() {
  const markets = useLiveQuery(() => db.markets.toArray())

  return (
    <div className="flex flex-wrap gap-[1px]" style={{ transform: 'translate3d(0, 0, 0)' }}>
      {markets?.map((market) => {
        return (
          <div
            key={market.market_id}
            className={clsx(
              'size-2',
              isResolvedMarket(market) ? 'bg-emerald-400' : 'bg-gray-200',
              'group-hover:bg-emerald-600',
            )}
          />
        )
        // return (
        //   <div className="group relative flex" key={market.market_id}>
        //     <div
        //       className={clsx(
        //         'size-2',
        //         isResolvedMarket(market) ? 'bg-emerald-400' : 'bg-gray-200',
        //         'group-hover:bg-emerald-600',
        //       )}
        //     />
        //     <div className="pointer-events-none absolute z-10 mt-4 w-[240px] -translate-x-1/2 bg-white px-4 py-3 text-sm text-gray-500 opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        //       <div className="font-semibold text-gray-900">{market.market_title}</div>
        //       <div>@{market.creator_username}</div>
        //     </div>
        //   </div>
        // )
      })}
    </div>
  )
}

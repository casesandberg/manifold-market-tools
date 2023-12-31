'use client'

import { db, isResolvedMarket } from '@/lib/db'
import clsx from 'clsx'
import { useLiveQuery } from 'dexie-react-hooks'
import moment from 'moment'
import { motion } from 'framer-motion'
import { Tooltip } from 'react-tooltip'

export function MarketsDotGrid() {
  const markets = useLiveQuery(() => db.markets.toArray())

  return (
    <div className="flex flex-wrap gap-[1px]" style={{ transform: 'translate3d(0, 0, 0)' }}>
      {markets?.map((market) => {
        const color = isResolvedMarket(market)
          ? 'bg-emerald-400'
          : moment(market.close_time).isBefore()
            ? 'bg-gray-400'
            : 'bg-gray-200'
        return (
          <motion.a
            href={market.url ?? ''}
            target="_blank"
            data-tooltip-id="tooltip"
            data-title={market.market_title}
            data-username={market.creator_username}
            data-tooltip-place="bottom"
            data-tooltip-variant="light"
            key={market.market_id + color}
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={clsx('size-2 hover:z-10 hover:ring-2 hover:ring-emerald-400 hover:ring-offset-1', color)}
          />
        )
      })}

      <Tooltip
        id="tooltip"
        className="rounded-none"
        render={({ activeAnchor }) => (
          <div className="m-0 w-[240px] rounded-none bg-white px-1 py-2 text-sm text-gray-500">
            <div className="font-semibold text-gray-900">{activeAnchor?.getAttribute('data-title')}</div>
            <div>@{activeAnchor?.getAttribute('data-username')}</div>
          </div>
        )}
      />
    </div>
  )
}

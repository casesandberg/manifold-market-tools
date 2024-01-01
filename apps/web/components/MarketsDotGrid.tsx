'use client'

import { db, isResolvedMarket } from '@/lib/db'
import clsx from 'clsx'
import { useLiveQuery } from 'dexie-react-hooks'
import moment from 'moment'
import { motion } from 'framer-motion'
import { Tooltip } from 'react-tooltip'
import { useMemo } from 'react'

export function MarketsDotGrid() {
  const markets = useLiveQuery(() => db.markets.toArray()) ?? []

  const filteredMarkets = useMemo(
    () => markets.filter((market) => moment(market.close_time).isBetween('Dec 28, 2023', 'Jan 2, 2024')),
    [markets],
  )

  return (
    <div className="flex flex-wrap gap-[1px]" style={{ transform: 'translate3d(0, 0, 0)' }}>
      {filteredMarkets?.map((market) => {
        const color = isResolvedMarket(market)
          ? 'bg-emerald-400'
          : moment(market.close_time).isBefore()
            ? 'bg-gray-300'
            : 'bg-gray-100'
        return (
          <motion.a
            href={market.url ?? ''}
            target="_blank"
            data-tooltip-id="tooltip"
            data-title={market.market_title}
            data-username={market.creator_username}
            data-status={
              isResolvedMarket(market)
                ? `<span class="text-emerald-400 text-xs font-semibold">Resolved</span>`
                : moment(market.close_time).isBefore()
                  ? `<span class="text-gray-600 text-xs font-semibold">Closed</span>`
                  : `<span class="text-gray-400 text-xs font-semibold">Closing Soon</span>`
            }
            data-tooltip-class-name="!opacity-100 !w-[240px] !rounded-none !bg-white !px-4 !py-3 !text-sm !text-gray-500 !shadow-md"
            data-tooltip-place="bottom"
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
          <>
            <div dangerouslySetInnerHTML={{ __html: activeAnchor?.getAttribute('data-status') ?? '' }}></div>
            <div className="font-semibold text-gray-900">{activeAnchor?.getAttribute('data-title')}</div>
            <div>@{activeAnchor?.getAttribute('data-username')}</div>
          </>
        )}
      />
    </div>
  )
}

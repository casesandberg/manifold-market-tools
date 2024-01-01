'use client'

import { db, isResolvedMarket } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import moment from 'moment'
import { Counter } from './Counter'
import { useMemo } from 'react'

export function MarketsStats({ initialTotal, initialResolved }: { initialTotal: number; initialResolved: number }) {
  const markets = useLiveQuery(() => db.markets.toArray()) ?? [] // eslint-disable-line react-hooks/exhaustive-deps

  const { closingMarkets, closedMarkets, resolvedMarkets, percentResolved } = useMemo(() => {
    const filteredMarkets = markets.filter((market) =>
      moment(market.close_time).isBetween('Dec 28, 2023', 'Jan 2, 2024'),
    )
    let closingMarkets = filteredMarkets.length ? 0 : initialTotal
    let closedMarkets = 0
    let resolvedMarkets = filteredMarkets.length ? 0 : initialResolved

    filteredMarkets.map((market) => {
      if (isResolvedMarket(market)) {
        resolvedMarkets++
        closedMarkets++
      } else if (moment(market.close_time).isBefore()) {
        closedMarkets++
      } else {
        closingMarkets++
      }
    })

    const percentResolved = closedMarkets ? Math.round((resolvedMarkets / closedMarkets) * 100) : 0

    return { closingMarkets, closedMarkets, resolvedMarkets, percentResolved }
  }, [markets])

  return (
    <div className="flex gap-8 sm:gap-16">
      <div className="hidden overflow-hidden sm:block">
        <dt className="truncate text-sm font-medium text-gray-500">Markets Closing</dt>
        <dd className="mt-1 font-serif text-3xl font-semibold tracking-tight text-gray-900">
          <Counter value={closingMarkets} height={40} />
        </dd>
      </div>
      <div className="overflow-hidden">
        <dt className="truncate text-sm font-medium text-gray-500">Closed</dt>
        <dd className="mt-1 font-serif text-3xl font-semibold tracking-tight text-gray-900">
          <Counter value={closedMarkets} height={40} />
        </dd>
      </div>
      <div className="overflow-hidden">
        <dt className="truncate text-sm font-medium text-gray-500">Resolved</dt>
        <dd className="mt-1 font-serif text-3xl font-semibold tracking-tight text-gray-900">
          <Counter value={resolvedMarkets} height={40} />
        </dd>
      </div>
      {percentResolved ? (
        <div className="overflow-hidden">
          <dt className="truncate text-sm font-medium text-gray-500">Percent</dt>
          <dd className="mt-1 flex font-serif text-3xl font-semibold tracking-tight text-gray-900">
            <Counter value={percentResolved} height={40} />%
          </dd>
        </div>
      ) : null}
    </div>
  )
}

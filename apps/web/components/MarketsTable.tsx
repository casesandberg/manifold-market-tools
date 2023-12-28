'use client'

import { db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'

export function MarketsTable() {
  const markets = useLiveQuery(() => db.markets.toArray())

  return <div>{markets?.map((market) => <div key={market.market_id}>{market.market_title} </div>)}</div>
}

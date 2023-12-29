'use client'

import Dexie, { Table } from 'dexie'

export type Market = {
  market_id: string
  market_title: string
  market_type: 'BINARY' | 'MULTIPLE_CHOICE' | 'FREE_RESPONSE' | 'POLL' | 'PSEUDO_NUMERIC' | 'STONK'
  url: string
  close_time: string
  probability: number // 0.0721244968092122,
  total_liquidity: number
  unique_bettor_count: number
  volume: number

  creator_name: string
  creator_username: string
  creator_user_id: string
  creator_avatar_url: string
  creator_profile_url: string
  creator_last_bet_time: string
  creator_deleted: boolean

  resolution: 'YES' | 'NO' | 'MKT' | null
  resolved_at: string | null
  resolver_name: string | null
  resolver_username: string | null
  resolver_user_id: string | null
  resolver_avatar_url: string | null
  resolver_profile_url: string | null
}

export function isResolvedMarket(market: Market) {
  return (
    market.resolution !== null &&
    market.resolved_at !== null &&
    market.resolver_name !== null &&
    market.resolver_username !== null &&
    market.resolver_user_id !== null &&
    market.resolver_avatar_url !== null &&
    market.resolver_profile_url !== null
  )
}

type Tables = {
  markets: Table<Market>
}

export type DB<T extends any = Tables> = Dexie & T

export const db = new Dexie('db') as DB

db.version(1).stores({
  markets: 'market_id, close_time, probability, unique_bettor_count, creator_user_id, resolved_at, resolver_user_id',
})

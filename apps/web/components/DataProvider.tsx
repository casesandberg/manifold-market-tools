'use client'

import { Market, db } from '@/lib/db'
import { createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use'
import { Socket } from 'phoenix'

const DataContext = createContext<{ isSyncing: boolean } | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [value, setValue] = useLocalStorage<Date>('MARKETS_LAST_FETCH')

  useEffect(() => {
    let socket = new Socket('ws://nyr.fly.dev/socket', { params: {} })
    socket.connect()

    let channel = socket.channel('updates:markets', {})
    channel
      .join()
      .receive('ok', (resp) => {
        console.log('Joined successfully', resp)
      })
      .receive('error', (resp) => {
        console.log('Unable to join', resp)
      })

    channel.on('market_updated', (market: Market) => {
      db.markets.put(market)
    })

    return () => {
      channel.leave()
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    setIsSyncing(true)
    try {
      fetch(`https://nyr.fly.dev/api/markets${value ? `?since=${new Date(value).toISOString()}` : ''}`)
        .then((res) => res.json())
        .then(({ data }) => {
          db.markets.bulkPut(data).then(() => {
            console.log('Added to DB')
            setValue(new Date())
            setIsSyncing(false)
          })
        })
    } catch (error) {
      console.error(error)
      setIsSyncing(false)
    }
  }, [])

  return <DataContext.Provider value={{ isSyncing }}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)

  if (context == undefined) {
    throw new Error('useData must be used within an DataProvider')
  }

  return context
}

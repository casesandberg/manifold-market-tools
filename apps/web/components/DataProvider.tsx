'use client'

import { db } from '@/lib/db'
import { createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use'

const DataContext = createContext<{ isSyncing: boolean } | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [value, setValue] = useLocalStorage<Date>('MARKETS_LAST_FETCH')

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

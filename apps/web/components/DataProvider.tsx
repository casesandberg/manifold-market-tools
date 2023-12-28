'use client'

import { db } from '@/lib/db'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use'

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useLocalStorage<Date>('MARKETS_LAST_FETCH')

  useEffect(() => {
    try {
      setLoading(true)
      //   fetch(`https://nyr.fly.dev/api/markets${value ? `?since=${value.toISOString()}` : ''}`)
      //     .then((res) => res.json())
      //     .then(({ data }) => {
      //       console.log(data)

      //       db.markets.bulkPut(data).then(() => {
      //         console.log('Added to DB')
      //         // setValue(new Date())
      //       })
      //     })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [])

  return children
}

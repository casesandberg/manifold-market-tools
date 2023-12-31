import { Leaderboard } from '@/components/Leaderboard'
import { MarketsDotGrid } from '@/components/MarketsDotGrid'
import { MarketsStats } from '@/components/MarketsStats'
import { RecentlyResolvedList } from '@/components/RecentlyResolvedList'
import { ResolvedMarketsGraph } from '@/components/ResolvedMarketsGraph'

const getStats = async () => {
  'use server'
  const res = await fetch('https://nyr.fly.dev/api/stats')
  return res.json() as Promise<{ resolved_markets: number; total_markets: number }>
}

export default async function Home() {
  const stats = await getStats()

  return (
    <main>
      <div className="mt-8 flex gap-12 border-b pb-8">
        <div className="flex-[3] lg:order-2">
          <MarketsStats initialTotal={stats.total_markets} initialResolved={stats.resolved_markets} />
        </div>
        <div className="flex-1 lg:order-1">
          <div className="overflow-hidden">
            <dt className="truncate text-sm font-medium text-gray-500">Manifold{"'"}s New Years</dt>
            <dd className="mt-1 font-serif text-3xl font-semibold tracking-tight text-gray-900">Resolutions</dd>
          </div>
        </div>
        <div className="flex-1 lg:order-3"></div>
      </div>
      <div className="mt-8 flex gap-12">
        <div className="flex min-w-0 flex-[3] flex-col gap-8 lg:order-2">
          <div className="h-[250px]">
            <ResolvedMarketsGraph />
          </div>
          <MarketsDotGrid />
        </div>
        <div className="flex-1 lg:order-1">
          <RecentlyResolvedList />
        </div>
        <div className="flex-1 lg:order-3">
          <Leaderboard />
        </div>
      </div>
      {/* Home
       */}
    </main>
  )
}

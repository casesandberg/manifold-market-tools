import { Leaderboard } from '@/components/Leaderboard'
import { MarketsDotGrid } from '@/components/MarketsDotGrid'
import { RecentlyResolvedList } from '@/components/RecentlyResolvedList'

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
          <div className="flex gap-16">
            <div className="overflow-hidden">
              <dt className="truncate text-sm font-medium text-gray-500">Markets Closing</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold tracking-tight text-gray-900">
                {stats.total_markets}
              </dd>
            </div>
            <div className="overflow-hidden">
              <dt className="truncate text-sm font-medium text-gray-500">Resolved</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold tracking-tight text-gray-900">
                {stats.resolved_markets}
              </dd>
            </div>
            <div className="overflow-hidden">
              <dt className="truncate text-sm font-medium text-gray-500">Percent</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold tracking-tight text-gray-900">
                {Math.round((stats.resolved_markets / stats.total_markets) * 100)}%
              </dd>
            </div>
          </div>
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
        <div className="flex-[3] lg:order-2">
          <div className="mb-8 h-[250px] w-full bg-gray-200"></div>
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

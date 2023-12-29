import { Leaderboard } from '@/components/Leaderboard'
import { MarketsDotGrid } from '@/components/MarketsDotGrid'
import { RecentlyResolvedList } from '@/components/RecentlyResolvedList'

export default function Home() {
  return (
    <main>
      <div className="mt-8 flex gap-8 border-b pb-8">
        <div className="flex-[2] lg:order-2">
          <div className="flex gap-16">
            <div className="overflow-hidden">
              <dt className="truncate text-sm font-medium text-gray-500">Markets Closing</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold tracking-tight text-gray-900">8000</dd>
            </div>
            <div className="overflow-hidden">
              <dt className="truncate text-sm font-medium text-gray-500">Resolved</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold tracking-tight text-gray-900">113</dd>
            </div>
            <div className="overflow-hidden">
              <dt className="truncate text-sm font-medium text-gray-500">Percent</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold tracking-tight text-gray-900">
                {Math.round((113 / 8000) * 100)}%
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
      <div className="mt-8 flex gap-8">
        <div className="flex-[2] lg:order-2">
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

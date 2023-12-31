'use client'

import { db, isResolvedMarket } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { LinearGradient } from '@visx/gradient'
import { curveMonotoneX } from '@visx/curve'
import { AreaClosed, Line, Bar } from '@visx/shape'
import { scaleTime, scaleLinear } from '@visx/scale'
import { Tooltip, useTooltip } from '@visx/tooltip'
import { bisector } from '@visx/vendor/d3-array'
import { localPoint } from '@visx/event'
import { useCallback, useMemo } from 'react'
import moment from 'moment'
import _ from 'lodash'
import ParentSize from '@visx/responsive/lib/components/ParentSize'

const primaryColor = '#34d399'
const secondaryColor = '#666'

type DataInterval = {
  resolvedCount: number
  closeCount: number
  cumulativeResolved: number
  cumulativeClosed: number
  hour: number
}

export type AreaProps = {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

const getHour = (d: DataInterval) => new Date(d.hour)
const bisectDate = bisector<DataInterval, Date>(getHour).left

const MarketCumSumChart = ({ width, height, margin = { top: 0, right: 0, bottom: 0, left: 0 } }: AreaProps) => {
  const markets = useLiveQuery(() => db.markets.toArray()) ?? [] // eslint-disable-line react-hooks/exhaustive-deps

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  } = useTooltip<DataInterval & { closedTop: number }>()

  const innerWidth = width - margin.left - margin.right + 1 // Cut off right border
  const innerHeight = height - margin.top - margin.bottom + 1 // Cut off bottom border

  const marketsByDate = useMemo(() => {
    const hourlyCounts: Record<number, Pick<DataInterval, 'resolvedCount' | 'closeCount'>> = {}

    markets.forEach((market) => {
      if (isResolvedMarket(market)) {
        const resolvedHour = moment(market.resolved_at).startOf('hour').valueOf()
        if (!hourlyCounts[resolvedHour]) {
          hourlyCounts[resolvedHour] = {
            resolvedCount: 0,
            closeCount: 0,
          }
        }
        hourlyCounts[resolvedHour].resolvedCount++
      }

      const closeHour = moment(market.close_time).startOf('hour').valueOf()
      if (!hourlyCounts[closeHour]) {
        hourlyCounts[closeHour] = {
          resolvedCount: 0,
          closeCount: 0,
        }
      }
      hourlyCounts[closeHour].closeCount++
    })

    let cumulativeResolved = 0
    let cumulativeClosed = 0

    const cumulativeCounts = _.chain(hourlyCounts)
      .map((counts, hour) => ({
        hour: parseInt(hour),
        resolvedCount: counts.resolvedCount,
        closeCount: counts.closeCount,
      }))
      .orderBy('hour')
      .map((entry) => {
        cumulativeResolved += entry.resolvedCount
        cumulativeClosed += entry.closeCount
        return { ...entry, cumulativeResolved, cumulativeClosed }
      })
      .value()

    return cumulativeCounts
  }, [markets])

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: [new Date('Dec 29, 2023'), marketsByDate[marketsByDate.length - 1]?.hour],
      }),
    [innerWidth, margin.left, marketsByDate],
  )

  const stockValueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, markets.length],
        nice: true,
      }),
    [margin.top, innerHeight, markets],
  )

  const now = new Date()

  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 }
      const x0 = dateScale.invert(x)
      const index = bisectDate(marketsByDate, x0, 1)
      const d0 = marketsByDate[index - 1]
      const d1 = marketsByDate[index]
      let d = d0
      if (d1 && getHour(d1)) {
        d = x0.valueOf() - getHour(d0).valueOf() > getHour(d1).valueOf() - x0.valueOf() ? d1 : d0
      }
      showTooltip({
        tooltipData: {
          ...d,
          closedTop: stockValueScale(d.cumulativeClosed),
        },
        tooltipLeft: x,
        tooltipTop: stockValueScale(d.cumulativeResolved),
      })
    },
    [showTooltip, stockValueScale, dateScale, marketsByDate],
  )

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <LinearGradient id="primary-gradient" from={primaryColor} to={primaryColor} fromOpacity={0.5} toOpacity={0.1} />
        <LinearGradient id="primary-gradient-border" from={primaryColor} to={primaryColor} toOpacity={0} />
        <LinearGradient
          id="secondary-gradient"
          from={secondaryColor}
          to={secondaryColor}
          fromOpacity={0.2}
          toOpacity={0}
        />
        <LinearGradient id="secondary-gradient-border" from={secondaryColor} to={secondaryColor} toOpacity={0} />

        <AreaClosed<DataInterval>
          data={marketsByDate}
          x={({ hour }) => dateScale(hour)}
          y={({ cumulativeClosed }) => stockValueScale(cumulativeClosed)}
          yScale={stockValueScale}
          strokeWidth={1}
          stroke="url(#secondary-gradient-border)"
          fill="url(#secondary-gradient)"
          curve={curveMonotoneX}
        />

        <AreaClosed<DataInterval>
          data={marketsByDate}
          x={({ hour }) => dateScale(hour)}
          y={({ hour, cumulativeResolved }) =>
            moment(hour).isAfter() ? markets.length : stockValueScale(cumulativeResolved)
          }
          yScale={stockValueScale}
          strokeWidth={1}
          stroke="url(#primary-gradient-border)"
          fill="url(#primary-gradient)"
          curve={curveMonotoneX}
        />

        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />

        <Line
          from={{ x: dateScale(now) - 2, y: margin.top }}
          to={{ x: dateScale(now) - 2, y: innerHeight + margin.top }}
          stroke={primaryColor}
          strokeWidth={1}
          pointerEvents="none"
          strokeDasharray="5,2"
        />

        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth={1}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill={primaryColor}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />

            <circle
              cx={tooltipLeft}
              cy={tooltipData.closedTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipData.closedTop}
              r={4}
              fill={secondaryColor}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>

      {tooltipData && (
        <Tooltip
          top={innerHeight + margin.top}
          left={tooltipLeft}
          className="absolute w-[140px] -translate-x-1/2 bg-white px-4 py-3 text-sm text-gray-500 shadow-md"
          style={{}}
        >
          <div className="font-semibold text-gray-900">{moment(tooltipData.hour).format('MMM D - hA')}</div>
          <div>
            Closed: <strong>{tooltipData.cumulativeClosed}</strong>
          </div>
          <div>
            Resolved: <strong className="text-emerald-500">{tooltipData.cumulativeResolved}</strong>
          </div>
        </Tooltip>
      )}
    </div>
  )
}

export function ResolvedMarketsGraph() {
  return (
    <ParentSize debounceTime={10} className="relative">
      {({ width: visWidth, height: visHeight }) => <MarketCumSumChart width={visWidth} height={visHeight} />}
    </ParentSize>
  )
}

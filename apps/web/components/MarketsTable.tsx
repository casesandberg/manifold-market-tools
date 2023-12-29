'use client'

import { Market, db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { Fragment, useMemo, useRef, useState } from 'react'
import {
  ColumnDef,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import clsx from 'clsx'
import moment from 'moment'
import { Popover, Transition } from '@headlessui/react'

export function MarketsTable() {
  const markets = useLiveQuery(() => db.markets.toArray()) ?? []

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'close_time',
      desc: false,
    },
  ])

  const columns = useMemo<Array<ColumnDef<Market>>>(
    () => [
      // {
      //   accessorKey: 'market_type',
      //   header: () => <span>Type</span>,
      //   cell: (info) => {
      //     const value = info.getValue()
      //     switch (value) {
      //       case 'BINARY':
      //         return 'BIN'
      //       case 'MULTIPLE_CHOICE':
      //         return 'MULTI'
      //       case 'FREE_RESPONSE':
      //         return 'FREE'
      //       case 'POLL':
      //         return 'POLL'
      //       case 'PSEUDO_NUMERIC':
      //         return 'NUM'
      //       case 'STONK':
      //         return 'STONK'
      //       default:
      //         return value
      //     }
      //   },
      //   size: 60,
      // },
      {
        accessorKey: 'market_title',
        header: () => <span>Market</span>,
        size: 600,
        cell: ({ row }) => {
          return (
            <a href={row.original.url} target="_blank">
              <span className="hover:underline">{row.original.market_title}</span>
            </a>
          )
        },
      },
      {
        accessorKey: 'creator_username',
        header: () => <span>Creator</span>,
        size: 150,
      },
      {
        id: 'last_seen',
        accessorFn: (row) => row.creator_last_bet_time ?? undefined,
        header: () => <span>Last Seen</span>,
        cell: (info) => (info.getValue() ? moment(info.getValue<string>()).fromNow(true) : '—'),
        sortUndefined: 1,
        size: 80,
      },
      {
        accessorKey: 'unique_bettor_count',
        header: () => <span>Bettors</span>,
        size: 50,
      },
      {
        id: 'probability',
        accessorFn: (row) => row.probability ?? undefined,
        header: () => <span>Prob</span>,
        sortUndefined: 1,
        size: 50,
        cell: (info) => (info.getValue<number>() ? Math.round(info.getValue<number>() * 100) : '—'),
      },
      {
        accessorKey: 'close_time',
        header: () => <span>Closes</span>,
        size: 80,
        cell: (info) => moment(info.getValue<string>()).format('MMM D'),
      },
      {
        id: 'claim',
        header: () => <span></span>,
        size: 50,
        cell: ({ row }) => {
          return (
            <a href={row.original.url} target="_blank">
              <span className="hover:underline">Claim</span>
            </a>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable({
    data: markets,
    columns,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  })

  const filters = [
    {
      id: 'state',
      name: 'State',
      options: [
        { value: 'unresolved', label: 'Unresolved', checked: true },
        { value: 'unclaimed', label: 'Unclaimed', checked: true },
        { value: 'creator-afk', label: 'Creator AFK', checked: false },
      ],
    },
    {
      id: 'market-type',
      name: 'Market Type',
      options: [
        { value: 'BINARY', label: 'Binary', checked: false },
        { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice', checked: false },
        { value: 'FREE_RESPONSE', label: 'Free Response', checked: false },
        { value: 'POLL', label: 'Poll', checked: false },
        { value: 'PSEUDO_NUMERIC', label: 'Pseudo Numeric', checked: false },
        { value: 'STONK', label: 'Stonk', checked: false },
      ],
    },
  ]
  const activeFilters = [
    { value: 'closes-soon', label: 'Closes in 2023' },
    { value: 'unresolved', label: 'Unresolved' },
    { value: 'unclaimed', label: 'Unclaimed' },
  ]

  return (
    <div>
      <section aria-labelledby="filter-heading">
        <div className="mt-4 py-4">
          <div className="mx-auto flex items-center justify-between px-3">
            <h3 className="text-lg font-semibold">Markets</h3>

            <div className="hidden sm:block">
              <div className="flow-root">
                <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
                  {filters.map((section, sectionIdx) => (
                    <Popover key={section.name} className="relative inline-block px-4 text-left">
                      <Popover.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        <span>{section.name}</span>
                        {/* {sectionIdx === 0 ? (
                          <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                            1
                          </span>
                        ) : null} */}
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <form className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </form>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  ))}
                </Popover.Group>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3">
          <div className="mt-2">
            <div className="-m-1 flex flex-wrap items-center">
              {activeFilters.map((activeFilter) => (
                <span
                  key={activeFilter.value}
                  className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
                >
                  <span>{activeFilter.label}</span>
                  <button
                    type="button"
                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                  >
                    <span className="sr-only">Remove filter for {activeFilter.label}</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="min-w-full divide-y divide-gray-200">
            <div>
              {table.getHeaderGroups().map((headerGroup) => (
                <div key={headerGroup.id} className="flex flex-row items-center">
                  {headerGroup.headers.map((header) => {
                    return (
                      <div
                        key={header.id}
                        style={{ flex: header.column.getSize() }}
                        className="truncate px-3 py-3.5 text-left text-sm font-semibold text-gray-400"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={clsx(
                              'flex gap-1',
                              header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                            )}
                            {...{
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <div className={clsx(header.column.getIsSorted() ? 'visible' : 'invisible')}>
                              <ChevronDownIcon
                                className={clsx(
                                  'h-5 w-5 text-gray-400',
                                  header.column.getIsSorted() === 'asc' ? 'rotate-180' : '',
                                )}
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
            <div className="divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => {
                return (
                  <div key={row.id} className="flex flex-row items-center">
                    {row.getVisibleCells().map((cell) => {
                      const context = cell.getContext()

                      return (
                        <div
                          key={cell.id}
                          style={{ flex: cell.column.getSize() }}
                          className={clsx(
                            'truncate',
                            'w-32 px-3 py-3 text-sm text-gray-500',
                            context.column.id === 'market_title' && 'font-medium text-gray-900',
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, context)}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between border-t px-3 py-3">
        <div className="flex flex-1 items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of{' '}
              <span className="font-medium">{table.getPageCount()}</span>
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex gap-4 rounded-md" aria-label="Pagination">
              <button
                className="relative inline-flex items-center rounded-md px-2 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:text-gray-400"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                <span className="mr-1 text-sm font-semibold ">Previous</span>
              </button>

              <button
                className="relative inline-flex items-center rounded-md px-2 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:text-gray-400"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="ml-1 text-sm font-semibold">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

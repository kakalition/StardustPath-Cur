import { useState } from "react";
import { AreaChart, ResponsiveContainer, Area, Tooltip } from "recharts";
import TransactionTile from "../components/transaction_tile";
import DateFilterChip from "../components/date_filter_chip";
import { DatePicker } from "@nextui-org/react";

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 398,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 800,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 908,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 800,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 800,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 300,
  },
];

function TransactionOverTime() {
  const [dateFilter, setDateFilter] = useState('1D');

  return (
    <div className='flex min-h-screen w-screen flex-col #bg-gray-50'>
      <ResponsiveContainer height={400} width="100%" >
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUv" x1="0" x2="0" y1="0" y2="1" >
              <stop offset="5%" stopColor="#0048bf" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6ba3ff" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area dataKey="pv" fill="url(#colorUv)" stroke="#001d4d" strokeWidth={2} type="monotone" />

          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mb-4 flex flex-row justify-between px-8">
        <DateFilterChip
          isActive={dateFilter == '1D'}
          onClick={() => setDateFilter('1D')}
          value="1D"
        />

        <DateFilterChip
          isActive={dateFilter == '1W'}
          onClick={() => setDateFilter('1W')}
          value="1W"
        />

        <DateFilterChip
          isActive={dateFilter == '1M'}
          onClick={() => setDateFilter('1M')}
          value="1M"
        />

        <DateFilterChip
          isActive={dateFilter == 'YTD'}
          onClick={() => setDateFilter('YTD')}
          value="YTD"
        />

        <DateFilterChip
          isActive={dateFilter == '1Y'}
          onClick={() => setDateFilter('1Y')}
          value="1Y"
        />

        <DateFilterChip
          isActive={dateFilter == 'CST'}
          onClick={() => setDateFilter('CST')}
          value="CST"
        />
      </div>

      <div className={`mb-4 flex flex-row justify-between px-4 ${dateFilter != 'CST' ? 'hidden' : ''}`}>
        <DatePicker label="From Date" />
        <div className="w-4"></div>
        <DatePicker label="To Date" />
      </div>

      <div className="mx-4  mb-2 flex flex-col rounded-lg bg-gray-100 p-4">
        <p className="mb-2 text-xl font-semibold text-gray-600">
          Overview
        </p>

        <div className="my-1 flex flex-row">
          <div className="flex w-1/2 flex-row items-center justify-between">
            <span className="text-sm text-gray-600">
              Total Tx
            </span>

            <span className="text-sm font-semibold text-gray-600">
              Rp4.590.000
            </span>
          </div>

          <div className="w-4" />

          <div className="flex w-1/2 flex-row items-center justify-between">
            <span className="text-sm text-gray-600">
              Total Vol
            </span>

            <span className="text-sm font-semibold text-gray-600">
              52
            </span>
          </div>
        </div>

        <div className="mb-1 flex flex-row">
          <div className="flex w-1/2 flex-row items-center justify-between">
            <span className="text-sm text-gray-600">
              Avg Tx
            </span>

            <span className="text-sm font-semibold text-gray-600">
              Rp590.000
            </span>
          </div>

          <div className="w-4" />

          <div className="flex w-1/2 flex-row items-center justify-between">
            <span className="text-sm text-gray-600">
              Avg Vol
            </span>

            <span className="text-sm font-semibold text-gray-600">
              1.5
            </span>
          </div>
        </div>

        <div className="mb-1 flex flex-row">
          <div className="flex w-1/2 flex-row items-center justify-between">
            <span className="text-sm text-gray-600">
              Tx High
            </span>

            <span className="text-sm font-semibold text-gray-600">
              Rp2.122.700
            </span>
          </div>

          <div className="w-4" />

          <div className="flex w-1/2 flex-row items-center justify-between">
            <span className="text-sm text-gray-600">
              Tx Low
            </span>

            <span className="text-sm font-semibold text-gray-600">
              Rp25.000
            </span>
          </div>
        </div>

        <div className="mb-1 flex flex-row">
          <div className="flex w-1/2 flex-row items-center justify-between">
            <span className="text-sm text-gray-600">
              Vol High
            </span>

            <span className="text-sm font-semibold text-gray-600">
              9
            </span>
          </div>

          <div className="w-4" />

          <div className="flex w-1/2 flex-row items-center justify-between">
            <span className="text-sm text-gray-600">
              Vol Low
            </span>

            <span className="text-sm font-semibold text-gray-600">
              0
            </span>
          </div>
        </div>
      </div>

      <div className="mx-4 mb-2 flex flex-col rounded-lg bg-gray-100 p-4">
        <p className="mb-2 text-xl font-semibold text-gray-600">
          Riwayat Transaksi
        </p>

        <p className="mb-3 text-sm font-medium text-gray-500">
          31 Juli 2024
        </p>

        <TransactionTile />

        <TransactionTile />

        <TransactionTile />

        <TransactionTile />

        <TransactionTile />

        <TransactionTile />

        <p className="my-3 text-sm font-medium text-gray-500">
          1 Agustus 2024
        </p>

        <TransactionTile />

        <TransactionTile />

        <TransactionTile />

        <TransactionTile />

        <TransactionTile />

        <TransactionTile />
      </div>
    </div>
  )
}

export default TransactionOverTime
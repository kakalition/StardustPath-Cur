import { useState } from "react";
import TransactionTile from "../components/transaction_tile";
import DateFilterChip from "../components/date_filter_chip";
import { DatePicker } from "@nextui-org/react";
import { Bar, BarChart, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: '🍿',
    amt: 2100,
  },
  {
    name: '🍿',
    amt: 2100,
  },
  {
    name: '🦗',
    amt: 980,
  },
  {
    name: '💻',
    amt: 4500,
  },
  {
    name: '🍿',
    amt: 2100,
  },
  {
    name: '🦗',
    amt: 980,
  },
  {
    name: '💻',
    amt: 4500,
  },
  {
    name: '🍿',
    amt: 2100,
  },
  {
    name: '🦗',
    amt: 980,
  },
  {
    name: '💻',
    amt: 4500,
  },
  {
    name: '🍿',
    amt: 2100,
  },
  {
    name: '🦗',
    amt: 980,
  },
  {
    name: '💻',
    amt: 4500,
  },
  {
    name: '🦗',
    amt: 980,
  },
  {
    name: '💻',
    amt: 4500,
  },
  {
    name: '🍿',
    amt: 2100,
  },
  {
    name: '🦗',
    amt: 980,
  },
  {
    name: '💻',
    amt: 4500,
  },
  {
    name: '🍿',
    amt: 2100,
  },
  {
    name: '🦗',
    amt: 980,
  },
  {
    name: '💻',
    amt: 4500,
  },
  {
    name: '🍿',
    amt: 2100,
  },
  {
    name: '🦗',
    amt: 980,
  },
  {
    name: '💻',
    amt: 4500,
  },
];

function CategoryDistribution() {
  const [dateFilter, setDateFilter] = useState('1D');
  const [value, setValue] = useState(null);
  const maxValue = data.map((e) => e.amt).reduce((prev, cur) => prev < cur ? cur : prev);

  return (
    <div className='my-4 flex min-h-screen w-screen flex-col #bg-gray-50'>
      <div className="mb-4 flex flex-row justify-between">
        <span>{value?.name ?? '-'}</span> 
        <span>{value?.amt ?? '0'}</span> 
      </div>

      <div className="mb-4 flex h-96 flex-row overflow-y-scroll pb-3">
        {data.map((e) =>
          <div className="mx-2 flex flex-col justify-end" onMouseEnter={() => setValue(e)} onMouseLeave={() => setValue(null)}>
            <div className="mb-2 rounded-md bg-blue-900" style={{ height: `${e.amt / maxValue * 100}%` }}></div>
            {e.name}
          </div>
        )
        }
      </div>

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
          Breakdown
        </p>

        <div className="flex w-full flex-col">
          <div className="mb-1 flex w-full flex-row items-center justify-between">
            <p className="text-base text-gray-700">🧘 Self-Reward</p>
            <p className="text-base text-gray-700">Rp2.250.000</p>
          </div>
          <div className="flex w-full flex-row items-center">
            <div className="relative flex w-full items-center">
              <div className="absolute h-[0.4rem] w-full rounded-full bg-gray-200"></div>
              <div className="absolute h-[0.4rem] w-3/4 rounded-full bg-gray-800"></div>
            </div>
            <div className="w-3"></div>
            <span className="text-xs text-gray-500">48.4%</span>
          </div>
        </div>

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

export default CategoryDistribution
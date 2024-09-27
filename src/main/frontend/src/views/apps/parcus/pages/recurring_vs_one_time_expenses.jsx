import { useMemo, useState } from "react"
import { Toaster } from "react-hot-toast"
import Utils from "../../../../utils"
import moment from "moment"
import useSWR from "swr"
import { Input, Tooltip } from "@nextui-org/react"
import BaseCard from "../components/base_card"
import * as R from "ramda"
import DateFilterChip from "../components/date_filter_chip"

function BarChartTooltip({ data, children }) {
  return (
    <Tooltip
      content={(
        <div className="flex flex-col">
          <p className="mb-1">{data.date}</p>
          <p>
            Transaksi Rutin:
            {Utils.getIndonesianCurrency(data.recurring)}
          </p>
          <p>
            Transaksi Sekali:
            {Utils.getIndonesianCurrency(data.oneTime)}
          </p>
        </div>
      )}
    >
      {children}
    </Tooltip>
  )
}

function RecurringVsOneTimeExpenses() {
  const [filter, setFilter] = useState({
    dateFilter: "YTD",
    startDate: moment().format("yyyy-MM-DD"),
    endDate: moment().format("yyyy-MM-DD"),
  })

  const { data } = useSWR([`${import.meta.env.VITE_BASE_API_URL}/api/insights/recurring-vs-one-time-expenses`, filter], Utils.fetcher)

  const highestSumAmount = useMemo(() => {
    return Object.values(data?.data ?? {})
      .map(e => e.recurring + e.oneTime)
      .toSorted((a, b) => b - a)
      .at(0) ?? 0
  }, [data])

  const highestExpenseCategoryValue = useMemo(() => {
    if (data == null) {
      return 0
    }

    return R.sort((a, b) => b - a, (data?.categories ?? [])
      .filter(e => e.type == "EXPENSE")
      .map((e) => {
        return e.total
      }))[0]
  }, [data])

  console.log("sorted", Object.values(data?.data ?? []).toSorted((a, b) => {
    if (a.date < b.date) {
      return 1
    }
    if (a.date > b.date) {
      return -1
    }
    return 0
  }).map(e => e.date))

  return (
    <>
      <div className="flex size-full flex-col gap-4 overflow-y-scroll #bg-gray-50 p-4">
        <BaseCard className="flex flex-none flex-col gap-4 p-4">
          <div className="flex h-[60rem] flex-none flex-row gap-4 overflow-x-scroll p-4">
            {(Object.values(data?.data ?? [])).toSorted((a, b) => {
              if (a.date < b.date) {
                return 1
              }
              if (a.date > b.date) {
                return -1
              }
              return 0
            })
              .map((e) => {
                return (
                  <div className="flex h-full flex-col items-center justify-end gap-2" key={e.date}>
                    <p className="text-gray-600">{Utils.formatToCompact(e.recurring + e.oneTime)}</p>
                    <BarChartTooltip data={e}>
                      <div className="w-16 rounded-lg bg-orange-400" style={{ height: `${e.oneTime / highestSumAmount * 100}%` }}></div>
                    </BarChartTooltip>
                    <BarChartTooltip data={e}>
                      <div className="w-16 rounded-lg bg-blue-400" style={{ height: `${e.recurring / highestSumAmount * 100}%` }}></div>
                    </BarChartTooltip>
                    <p className="text-xl text-gray-900">{e.date.toString().substring(2).padStart(2, "0")}</p>
                  </div>
                )
              })}
          </div>
          <div className="my-4 flex flex-row justify-between px-8">
            <DateFilterChip
              isActive={filter.dateFilter == "YTD"}
              onClick={() => setFilter(prev => ({ ...prev, ["dateFilter"]: "YTD" }))}
              value="YTD"
            />

            <DateFilterChip
              isActive={filter.dateFilter == "1Y"}
              onClick={() => setFilter(prev => ({ ...prev, ["dateFilter"]: "1Y" }))}
              value="1Y"
            />

            <DateFilterChip
              isActive={filter.dateFilter == "3Y"}
              onClick={() => setFilter(prev => ({ ...prev, ["dateFilter"]: "3Y" }))}
              value="3Y"
            />

            <DateFilterChip
              isActive={filter.dateFilter == "5Y"}
              onClick={() => setFilter(prev => ({ ...prev, ["dateFilter"]: "5Y" }))}
              value="5Y"
            />

            <DateFilterChip
              isActive={filter.dateFilter == "CST"}
              onClick={() => setFilter(prev => ({ ...prev, ["dateFilter"]: "CST" }))}
              value="CST"
            />
          </div>
          <div className={`mb-4 flex flex-row justify-between px-4 ${filter.dateFilter != "CST" ? "hidden" : ""}`}>
            <Input label="From Date" type="date" />
            <div className="w-4"></div>
            <Input label="To Date" type="date" />
          </div>
        </BaseCard>
        <div className="grid grid-cols-12 gap-3">
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Arus Kas Bersih</span>
            <span className="text-xl font-medium text-gray-900">{Utils.getIndonesianCurrency(data?.keyData?.totalTx ?? 0)}</span>
          </BaseCard>
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Jumlah Pendapatan</span>
            <span className="text-xl font-medium text-gray-900">{Utils.getIndonesianCurrency(data?.keyData?.totalIncome ?? 0)}</span>
          </BaseCard>
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Jumlah Pengeluaran</span>
            <span className="text-xl font-medium text-gray-900">{Utils.getIndonesianCurrency(data?.keyData?.totalExpense ?? 0)}</span>
          </BaseCard>
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Periode</span>
            <span className="text-xl font-medium text-gray-900">
              {moment(data?.startDate).format("DD MMMM YYYY")}
              {" - "}
              {moment(data?.endDate).format("DD MMMM YYYY")}
            </span>
          </BaseCard>
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Rata-Rata Pendapatan</span>
            <span className="text-xl font-medium text-gray-900">{Utils.getIndonesianCurrency(data?.keyData?.avgIncomeTx ?? 0)}</span>
          </BaseCard>
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Rata-Rata Pengeluaran</span>
            <span className="text-xl font-medium text-gray-900">{Utils.getIndonesianCurrency(data?.keyData?.avgExpenseTx ?? 0)}</span>
          </BaseCard>
        </div>

        <BaseCard className="flex h-[28rem] flex-none flex-col p-4">
          <span className="mb-4 text-xl font-medium text-gray-800">Perbandingan Pengeluaran</span>
          <div className="flex h-full flex-row justify-start gap-4 overflow-x-scroll">
            {R.sort((a, b) => b.total - a.total, (data?.categories ?? []).filter(e => e.type == "EXPENSE")).map((e) => {
              return (
                <div className="flex flex-col items-center justify-end" key={e.name}>
                  <Tooltip content={(
                    <div className="flex flex-col">
                      <p className="mb-1">{e.name}</p>
                      <p>{Utils.getIndonesianCurrency(e.total)}</p>
                    </div>
                  )}
                  >
                    <div className="w-12 rounded-lg bg-orange-400" style={{ height: `${e.total / highestExpenseCategoryValue * 100}%` }}></div>
                  </Tooltip>
                  <span className="mt-4 text-gray-700">{e.name.split(" ")[0]}</span>
                </div>
              )
            })}
          </div>
        </BaseCard>

      </div>
      <Toaster />
    </>
  )
}

export default RecurringVsOneTimeExpenses

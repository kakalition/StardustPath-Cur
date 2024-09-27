import { useEffect, useMemo, useState } from "react"
import DateFilterChip from "../components/date_filter_chip"
import { DatePicker, Tooltip } from "@nextui-org/react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, BarChart, CartesianGrid, Legend, Bar, Rectangle } from "recharts"
import moment from "moment"
import { Toaster } from "react-hot-toast"
import Utils from "../../../../utils"
import * as R from "ramda"
import useSWR from "swr"
import BaseCard from "../components/base_card"

function IncomeVsExpenseOverTime() {
  const [dateFilter, setDateFilter] = useState("YTD")
  const [chartData, setChartData] = useState([])
  const [yAxisWidth, setYAxisWidth] = useState(70)

  const { data } = useSWR([`${import.meta.env.VITE_BASE_API_URL}/api/insights/income-vs-expense-over-time`, { dateFilter }], Utils.fetcher)
  async function processRawData(rawData) {
    const temp = []
    Object.keys(rawData?.data ?? {}).forEach((key) => {
      temp.push({
        name: key,
        expense: rawData.data[key]["expense"],
        income: rawData.data[key]["income"],
        xLabel: moment(key).format("YYYY/MM"),
      })
    })

    if (temp.length == 1) {
      temp.push(temp[0])
    }

    console.log("cahrtdata", temp)
    setChartData(temp)
  }

  useEffect(() => {
    processRawData(data)
  }, [data])

  const onWindowResize = () => {
    setYAxisWidth(window.innerWidth < 768 ? 0 : 70)
  }

  useEffect(() => {
    onWindowResize()
    window.addEventListener("resize", onWindowResize)
  }, [])

  // const highestExpenseCategoryValue = useMemo(() => {
  //   if (data == null) {
  //     return 0
  //   }

  //   return R.sort((a, b) => b - a, (data?.categories ?? [])
  //     .filter(e => e.type == "EXPENSE")
  //     .map((e) => {
  //       return e.total
  //     }))[0]
  // }, [data])

  return (
    <>
      <div className="flex size-full flex-col gap-4 overflow-y-scroll #bg-gray-50 p-4">
        <div className="rounded-xl border-2 border-gray-200 py-2 pl-0 pr-4">
          <ResponsiveContainer height={700} width="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="income" fill="#60a5fa" radius={[5, 5, 0, 0]} />
              <Bar dataKey="expense" fill="#fb923c" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="my-4 flex flex-row justify-between px-8">
            <DateFilterChip
              isActive={dateFilter == "YTD"}
              onClick={() => setDateFilter("YTD")}
              value="YTD"
            />

            <DateFilterChip
              isActive={dateFilter == "1Y"}
              onClick={() => setDateFilter("1Y")}
              value="1Y"
            />

            <DateFilterChip
              isActive={dateFilter == "3Y"}
              onClick={() => setDateFilter("3Y")}
              value="3Y"
            />

            <DateFilterChip
              isActive={dateFilter == "5Y"}
              onClick={() => setDateFilter("5Y")}
              value="5Y"
            />

            <DateFilterChip
              isActive={dateFilter == "CST"}
              onClick={() => setDateFilter("CST")}
              value="CST"
            />
          </div>
        </div>

        <div className={`mb-4 flex flex-row justify-between px-4 ${dateFilter != "CST" ? "hidden" : ""}`}>
          <DatePicker label="From Date" />
          <div className="w-4"></div>
          <DatePicker label="To Date" />
        </div>

        {/* <div className="grid grid-cols-12 gap-3">
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Periode</span>
            <span className="text-xl font-medium text-gray-900">
              {moment(data?.startDate).format("YYYY MMMM")}
              {" - "}
              {moment(data?.endDate).format("YYYY MMMM")}
            </span>
          </BaseCard>
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Jumlah Pengeluaran</span>
            <span className="text-xl font-medium text-gray-900">{Utils.getIndonesianCurrency(data?.keyData?.totalExpense ?? 0)}</span>
          </BaseCard>
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Rata-Rata Pengeluaran</span>
            <span className="text-xl font-medium text-gray-900">{Utils.getIndonesianCurrency(data?.keyData?.avgExpenseTx ?? 0)}</span>
          </BaseCard>
        </div>

        <BaseCard className="flex h-96 flex-col p-4">
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
        </BaseCard> */}
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

        <div className="h-8">&nbsp;</div>
      </div>
      <Toaster />
    </>
  )
}

export default IncomeVsExpenseOverTime
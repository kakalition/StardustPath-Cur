import { useEffect, useMemo, useState } from "react"
import DateFilterChip from "../components/date_filter_chip"
import { DatePicker, Tooltip } from "@nextui-org/react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts"
import moment from "moment"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import Utils from "../../../../utils"
import * as R from "ramda"
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react"
import BaseCard from "../components/base_card"

function Dashboard() {
  const [data, setData] = useState(null)
  const [chartData, setChartData] = useState([])

  const [dateFilter, setDateFilter] = useState("1D")

  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"))
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"))

  const [yAxisWidth, setYAxisWidth] = useState(70)

  const onWindowResize = () => {
    setYAxisWidth(window.innerWidth < 768 ? 0 : 70)
  }

  useEffect(() => {
    onWindowResize()
    window.addEventListener("resize", onWindowResize)
  }, [])

  useEffect(() => {
    const currentDate = moment()
    let startDate
    let endDate

    if (dateFilter == "1D") {
      startDate = currentDate.format("YYYY-MM-DD")
      endDate = currentDate.format("YYYY-MM-DD")
    }

    if (dateFilter == "1W") {
      const temp = currentDate.clone().subtract(6, "days")

      startDate = temp.format("YYYY-MM-DD")
      endDate = currentDate.format("YYYY-MM-DD")
    }

    if (dateFilter == "1M") {
      const temp = currentDate.clone().subtract(1, "months")

      startDate = temp.format("YYYY-MM-DD")
      endDate = currentDate.format("YYYY-MM-DD")
    }

    if (dateFilter == "1Y") {
      const temp = currentDate.clone().subtract(1, "year")

      startDate = temp.format("YYYY-MM-DD")
      endDate = currentDate.format("YYYY-MM-DD")
    }

    if (dateFilter == "YTD") {
      const temp = currentDate.clone()
        .set("year", currentDate.year)
        .set("month", 1)
        .set("day", 1)

      startDate = temp.format("YYYY-MM-DD")
      endDate = currentDate.format("YYYY-MM-DD")
    }

    setStartDate(startDate)
    setEndDate(endDate)

    fetchData(startDate, endDate)
  }, [dateFilter])

  const fetchData = async (startDate, endDate) => {
    const params = new URLSearchParams({
      page: 0,
      size: 20,
      startDate,
      endDate,
    })

    const promise = axios({
      url: `${import.meta.env.VITE_BASE_API_URL}/api/insights/overall-net-cashflow?${params}`,
      method: "GET",
      withCredentials: true,
    })

    toast.promise(
      promise,
      {
        loading: "Sedang mengambil data..",
        success: "Berhasil mengambil data",
        error: "Gagal mengambil data",
      },
    )

    const raw = (await promise).data

    setData(raw)

    const temp = []
    Object.keys(raw.txMap).forEach((key) => {
      temp.push({
        name: key,
        amount: raw.txMap[key],
        xLabel: moment(key).format("DD/MM"),
        yLabel: raw.txMap[key] / 1000,
      })
    })

    if (temp.length == 1) {
      temp.push(temp[0])
    }

    setChartData(temp)
  }

  const getChartColor = netValue => ({
    stopOne: netValue >= 0 ? "#66C2A4" : "#F27863",
    stopTwo: netValue >= 0 ? "#36A261" : "#E55934",
    stroke: netValue >= 0 ? "#36A261" : "#E55934",
  })

  const chartColor = useMemo(() => getChartColor(data?.keyData?.totalTx ?? 0), [data])

  const highestIncomeCategoryValue = useMemo(() => {
    if (data == null) {
      return 0
    }

    return R.sort((a, b) => b - a, (data?.categories ?? [])
      .filter(e => e.type == "INCOME")
      .map((e) => {
        return e.total
      }))[0]
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

  const highestCashFlow = useMemo(() => {
    return Math.max(data?.keyData?.totalIncome ?? 0, (data?.keyData?.totalExpense ?? 0))
  }, [data])

  return (
    <>
      <div className="flex size-full flex-col gap-4 overflow-y-scroll #bg-gray-50 p-4">
        <div className="rounded-xl border-2 border-gray-200 py-2 pl-0 pr-4">
          <ResponsiveContainer height={700} width="100%">
            <AreaChart className="pl-4" data={chartData}>
              <defs>
                <linearGradient id="colorUv" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor={chartColor.stopOne} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartColor.stopTwo} stopOpacity={0} />
                </linearGradient>
              </defs>

              <RechartsTooltip content={<CustomTooltip />} />
              <Area dataKey="amount" fill="url(#colorUv)" stroke={chartColor.stroke} strokeWidth={2} type="monotone" />

              <YAxis className="hidden md:block" width={yAxisWidth} />
              <XAxis className="hidden md:block" dataKey="xLabel" />

            </AreaChart>
          </ResponsiveContainer>

          <div className="my-4 flex flex-row justify-between px-8">
            <DateFilterChip
              isActive={dateFilter == "1D"}
              onClick={() => setDateFilter("1D")}
              value="1D"
            />

            <DateFilterChip
              isActive={dateFilter == "1W"}
              onClick={() => setDateFilter("1W")}
              value="1W"
            />

            <DateFilterChip
              isActive={dateFilter == "1M"}
              onClick={() => setDateFilter("1M")}
              value="1M"
            />

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
              {moment(startDate).format("DD MMMM YYYY")}
              {" - "}
              {moment(endDate).format("DD MMMM YYYY")}
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

        <div className="grid grid-cols-12 gap-3">
          <BaseCard className="col-span-12 flex h-96 flex-col p-4 md:col-span-2">
            <span className="mb-4 text-xl font-medium text-gray-800">Perbandingan Arus</span>
            <div className="flex h-full flex-row justify-start gap-4">
              <div className="flex w-full flex-col items-center justify-end">
                <Tooltip content={Utils.getIndonesianCurrency(data?.keyData?.totalIncome ?? 0)}>
                  <div className="w-full rounded-lg bg-blue-400" style={{ height: `${(data?.keyData?.totalIncome ?? 0) / highestCashFlow * 100}%` }}></div>
                </Tooltip>
                <IconArrowDown className="mt-4 stroke-gray-600" />
              </div>
              <div className="flex w-full flex-col items-center justify-end">
                <Tooltip content={Utils.getIndonesianCurrency(data?.keyData?.totalExpense ?? 0)}>
                  <div className="w-full rounded-lg bg-orange-400" style={{ height: `${((data?.keyData?.totalExpense ?? 0)) / highestCashFlow * 100}%` }}></div>
                </Tooltip>
                <IconArrowUp className="mt-4 stroke-gray-600" />
              </div>
            </div>
          </BaseCard>

          <BaseCard className="col-span-12 flex h-96 flex-col p-4 md:col-span-5">
            <span className="mb-4 text-xl font-medium text-gray-800">Perbandingan Pemasukan</span>
            <div className="flex h-full flex-row justify-start gap-4 overflow-x-scroll">
              {R.sort((a, b) => b.total - a.total, (data?.categories ?? []).filter(e => e.type == "INCOME")).map((e) => {
                return (
                  <div className="flex flex-col items-center justify-end" key={e.name}>
                    <Tooltip content={(
                      <div className="flex flex-col">
                        <p className="mb-1">{e.name}</p>
                        <p>{Utils.getIndonesianCurrency(e.total)}</p>
                      </div>
                    )}
                    >
                      <div className="w-12 rounded-lg bg-blue-400" style={{ height: `${e.total / highestIncomeCategoryValue * 100}%` }}></div>
                    </Tooltip>
                    <span className="mt-4 text-gray-700">{e.name.split(" ")[0]}</span>
                  </div>
                )
              })}
            </div>
          </BaseCard>

          <BaseCard className="col-span-12 flex h-96 flex-col p-4 md:col-span-5">
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

        <div className="h-8">&nbsp;</div>
      </div>
      <Toaster />
    </>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border-1 border-gray-300 #bg-gray-50 p-2">
        <div>
          {payload.map(pld => (
            <div key={pld.name} style={{ display: "inline-block", padding: 10 }}>
              <div style={{ color: pld.fill }}>{Utils.getLocaleDate(moment(pld.payload.name).toDate())}</div>
              <div>{Utils.getIndonesianCurrency(Math.round(pld.payload.amount))}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export default Dashboard

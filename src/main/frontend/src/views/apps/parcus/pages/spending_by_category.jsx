import { useEffect, useMemo, useState } from "react"
import DateFilterChip from "../components/date_filter_chip"
import { DatePicker, Tooltip } from "@nextui-org/react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts"
import moment from "moment"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import Utils from "../../../../utils"
import * as R from "ramda"
import BaseCard from "../components/base_card"

function SpendingByCategory() {
  const [data, setData] = useState(null)
  const [chartData, setChartData] = useState([])
  const [allChartData, setAllChartData] = useState([])

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
      url: `${import.meta.env.VITE_BASE_API_URL}/api/insights/spending-by-category?${params}`,
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

    const allCategoriesTemp = []
    const temp = {}
    Object.keys(raw.transactionMap).forEach((key) => {
      Object.keys(raw.transactionMap[key]).forEach((date, index) => {
        if (temp[key] === undefined) {
          temp[key] = []
        }

        temp[key].push({
          name: date,
          amount: raw.transactionMap[key][date],
          xLabel: moment(date).format("DD/MM"),
        })

        if (allCategoriesTemp[index] === undefined) {
          allCategoriesTemp[index] = {}
        }

        allCategoriesTemp[index].name = date
        allCategoriesTemp[index][key] = raw.transactionMap[key][date]
        allCategoriesTemp[index].xLabel = moment(date).format("DD/MM")
      })
    })

    if (temp.length == 1) {
      temp.push(temp[0])
    }

    setChartData(temp)
    setAllChartData(allCategoriesTemp)
    console.log(allCategoriesTemp)
  }

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

  return (
    <>
      <div className="flex size-full flex-col gap-4 overflow-y-scroll #bg-gray-50 p-4">
        <div className="rounded-xl border-2 border-gray-200 py-2 pl-0 pr-4">
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

          <div className={`mb-4 flex flex-row justify-between px-4 ${dateFilter != "CST" ? "hidden" : ""}`}>
            <DatePicker label="From Date" />
            <div className="w-4"></div>
            <DatePicker label="To Date" />
          </div>

          <ResponsiveContainer height={300} width="100%">
            <AreaChart className="pl-4" data={allChartData}>
              <defs>
                <linearGradient id="amount" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#69C3FF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0073BF" stopOpacity={0} />
                </linearGradient>
              </defs>

              <RechartsTooltip />

              {Object.keys((allChartData[0] ?? {})).filter(e => !["name", "xLabel"].includes(e)).map((e) => {
                console.log("iterating", e)
                return (
                  <Area dataKey={e} fill="url(#amount)" key={e} stroke="#0073BF" strokeWidth={2} type="monotone" />
                )
              })}

              <YAxis className="hidden md:block" width={yAxisWidth} />
              <XAxis className="hidden md:block" dataKey="xLabel" />

            </AreaChart>
          </ResponsiveContainer>
        </div>

        {Object.keys(chartData).map((chartDataKey) => {
          return (
            <div className="rounded-xl border-2 border-gray-200 py-2 pl-0 pr-4" key={chartDataKey}>
              <h3 className="pb-8 pl-8 pt-4">
                Kategori:
                {" "}
                {chartDataKey}
              </h3>
              <ResponsiveContainer height={300} width="100%">
                <AreaChart className="pl-4" data={chartData[chartDataKey]}>
                  <defs>
                    <linearGradient id="amount" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#69C3FF" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0073BF" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <RechartsTooltip />
                  <Area dataKey="amount" fill="url(#amount)" stroke="#0073BF" strokeWidth={2} type="monotone" />

                  <YAxis className="hidden md:block" width={yAxisWidth} />
                  <XAxis className="hidden md:block" dataKey="xLabel" />

                </AreaChart>
              </ResponsiveContainer>
            </div>
          )
        })}

        <div className="grid grid-cols-12 gap-3">
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Periode</span>
            <span className="text-xl font-medium text-gray-900">
              {moment(startDate).format("DD MMMM YYYY")}
              {" - "}
              {moment(endDate).format("DD MMMM YYYY")}
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

        <BaseCard className="col-span-12 flex h-96 flex-col p-4 md:col-span-5">
          <span className="mb-4 text-xl font-medium text-gray-800">Perbandingan Pengeluaran</span>
          <div className="flex h-full flex-row justify-start gap-4 overflow-x-scroll">
            {R.sort((a, b) => b.total - a.total, (data?.categories ?? [])).map((e) => {
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

        <div className="h-8">&nbsp;</div>
      </div>
      <Toaster />
    </>
  )
}

export default SpendingByCategory
import { useEffect, useState } from "react"
import * as R from "ramda"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { Select, SelectItem, Tooltip } from "@nextui-org/react"
import Utils from "../../../../utils"
import moment from "moment"
import BaseCard from "../components/base_card"

function ExpensesByDayOfTheWeekAndTimeOfTheDay() {
  const [data, setData] = useState([])
  const [dataKeys, setDataKeys] = useState([])
  const [highestAmount, setHighestAmount] = useState(0)

  const [year, setYear] = useState(moment().format("YYYY"))

  useEffect(() => {
    fetchData()
  }, [year])

  const fetchData = async () => {
    const params = new URLSearchParams({
      page: 0,
      size: 20,
      year: year,
    })

    const promise = axios({
      url: `${import.meta.env.VITE_BASE_API_URL}/api/insights/expenses-by-day-of-the-week-and-time-of-the-day?${params}`,
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

    const raw = (await promise).data.txMap ?? []
    setData(raw)

    const dataKeys = Object.keys(raw)
    dataKeys.sort()
    setDataKeys(dataKeys)

    const tempHighest = R.sort((a, b) => b - a, Object.values(raw))[0]
    setHighestAmount(tempHighest == 0 ? 1 : tempHighest)
  }

  return (
    <>
      <div className="flex size-full flex-col gap-4 overflow-y-scroll #bg-gray-50 p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="md:col-span-9">&nbsp;</div>
          <Select
            className="col-span-12 md:col-span-3"
            label="Tahun"
            onChange={e => setYear(e.target.value)}
            selectedKeys={[year]}
          >
            {[2024, 2025, 2026, 2027].map(e => (
              <SelectItem key={e} textValue={`${e}`}>
                {e}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="grid size-full grid-cols-12 gap-4">

          {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((month) => {
            return (
              <BaseCard className="col-span-12 p-4 md:col-span-6 lg:col-span-4" key={month}>
                <p className="mb-4">{moment().set("month", parseInt(month) - 1).format("MMMM")}</p>
                <div className="grid grid-cols-7 gap-2">
                  {dataKeys.filter(e => e.startsWith(`${year}-${month}-`)).map((key) => {
                    const opacity = Utils.coalesce(0.1, 1, data[key] / highestAmount)

                    return (
                      <Tooltip content={Utils.getIndonesianCurrency(data[key])} key={key}>
                        <div className="col-span-1 flex aspect-square size-full cursor-pointer items-center justify-center rounded-lg" style={{ backgroundColor: `rgb(66, 135, 245, ${opacity})` }}>
                          <span className="opacity-90" style={{ color: `${opacity > 0.8 ? "white" : "black"}` }}>{key.split("-")[2]}</span>
                        </div>
                      </Tooltip>
                    )
                  })}
                </div>
              </BaseCard>
            )
          })}
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default ExpensesByDayOfTheWeekAndTimeOfTheDay

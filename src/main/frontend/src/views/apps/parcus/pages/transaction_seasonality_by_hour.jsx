import { useEffect, useState } from "react"
import * as R from "ramda"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { Select, SelectItem, Tooltip } from "@nextui-org/react"
import Utils from "../../../../utils"
import moment from "moment"
import BaseCard from "../components/base_card"

function TransactionSeasonalityByHour() {
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
    setDataKeys(Object.keys(raw))

    const tempHighest = R.sort((a, b) => b - a, Object.values(raw))[0]
    setHighestAmount(tempHighest == 0 ? 1 : tempHighest)
  }

  const hours = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

  return (
    <>
      <div className="flex size-full flex-col overflow-y-scroll #bg-gray-50 p-4">
        <div className="grid grid-cols-12">
          <div className="md:col-span-9">&nbsp;</div>
          <Select
            className="col-span-12 mb-3 md:col-span-3"
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
        <BaseCard className="flex w-full flex-col p-4">
          <div className="grid size-full gap-x-20 gap-y-4 overflow-x-scroll" style={{ gridTemplateColumns: "repeat(25, minmax(0, 1fr))" }}>
            {["", ...hours].map((hour) => {
              const opacity = 0

              return (
                <Tooltip content="TODO" key={hour}>
                  <div className="col-span-1 flex aspect-square w-16 cursor-pointer items-center justify-center rounded-lg" style={{ backgroundColor: `rgb(66, 135, 245, ${opacity})` }}>
                    <span className="flex-none opacity-90" style={{ color: `${opacity > 0.8 ? "white" : "black"}` }}>{hour}</span>
                  </div>
                </Tooltip>
              )
            })}

            {days.map((day) => {
              return [day, ...hours].map((item) => {
                const opacity = item != "" && !days.includes(item)
                  ? Utils.coalesce(0.1, 1, 0.1)
                  : 0

                return (
                  <Tooltip content="TODO" key={item}>
                    <div className="col-span-1 flex aspect-square w-16 cursor-pointer items-center justify-center rounded-lg" style={{ backgroundColor: `rgb(66, 135, 245, ${opacity})` }}>
                      <span className="flex-none opacity-90" style={{ color: `${opacity > 0.8 ? "white" : "black"}` }}>{item}</span>
                    </div>
                  </Tooltip>
                )
              })
            })}

          </div>
        </BaseCard>
      </div>
      <Toaster />
    </>
  )
}

export default TransactionSeasonalityByHour

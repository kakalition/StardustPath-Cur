import { useMemo, useState } from "react"
import { Toaster } from "react-hot-toast"
import Utils from "../../../../utils"
import moment from "moment"
import { useForm } from "react-hook-form"
import useSWR from "swr"
import { Button, Input, Tooltip } from "@nextui-org/react"
import BaseCard from "../components/base_card"
import * as R from "ramda"

function HourlySpendingHeatMap() {
  const defaultValues = {
    startDate: moment().subtract(1, "weeks").format("yyyy-MM-DD"),
    endDate: moment().format("yyyy-MM-DD"),
  }

  const { register, handleSubmit } = useForm({ defaultValues })
  const [filterData, setFilterData] = useState(defaultValues)
  const { data } = useSWR([`${import.meta.env.VITE_BASE_API_URL}/api/insights/hourly-spending-heat-map`, { ...filterData }], Utils.fetcher)

  const highestAmountOnDay = useMemo(() => {
    return Object.values(data?.data ?? {})
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

  return (
    <>
      <div className="flex size-full flex-col gap-4 overflow-y-scroll #bg-gray-50 p-4">
        <form className="grid grid-cols-12 gap-4" onSubmit={handleSubmit(setFilterData)}>
          <Input {...register("startDate")} className="col-span-5" label="Tanggal Awal" type="date" />
          <Input {...register("endDate")} className="col-span-5" label="Tanggal Akhir" type="date" />
          <Button className="col-span-2 h-full" color="primary" type="submit" variant="flat">
            <span className="text-lg">Cari</span>
          </Button>
        </form>
        <BaseCard className="flex h-[60rem] flex-none flex-row gap-4 overflow-x-scroll p-4">
          {Utils.getRange(0, 23, 1).map((e) => {
            return (
              <div className="flex size-full min-w-12 flex-col items-center justify-end gap-2" key={e}>
                <p className="text-gray-600">{Utils.formatToCompact(data?.data?.[e])}</p>
                <div className="w-full rounded-lg bg-blue-400" style={{ height: `${data?.data?.[e] / highestAmountOnDay * 100}%` }}></div>
                <p className="text-xl text-gray-900">{e.toString().padStart(2, "0")}</p>
              </div>
            )
          })}
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

export default HourlySpendingHeatMap

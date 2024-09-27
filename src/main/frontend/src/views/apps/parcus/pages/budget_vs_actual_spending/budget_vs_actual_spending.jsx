import { Table, TableHeader, Tooltip, TableColumn, TableBody, TableRow, TableCell, Button, Input, SelectItem, Select, Spinner, Chip } from "@nextui-org/react"
import { IconSearch } from "@tabler/icons-react"
import { useForm } from "react-hook-form"
import useBudgetsViewModel from "./use_budget_vs_actual_spending_viewmodel"
import moment from "moment"
import Utils from "../../../../../utils"
import BaseCard from "../../components/base_card"
import { useMemo } from "react"
import * as R from "ramda"

const BudgetVsActualSpending = () => {
  const {
    paginationElement,
    loadingState,
    pages,
    data,
    queryParams,
    setQueryParams,
    onSearch,
  } = useBudgetsViewModel()

  const {
    register,
    handleSubmit,
  } = useForm()

  const columns = [
    {
      key: "categoryName",
      label: "KATEGORI",
    },
    {
      key: "amount",
      label: "ANGGARAN",
    },
    {
      key: "used",
      label: "TERPAKAI",
    },
    {
      key: "variance",
      label: "VARIANSI",
    },
    {
      key: "status",
      label: "STATUS",
    },
    {
      key: "usage",
      label: "PEMAKAIAN",
    },
  ]

  const highestAmount = useMemo(() => {
    const temp = R.sort(
      (a, b) => b - a,
      R.flatten((data?.data?.map(e => [e.amount, e.used])) ?? []),
    )[0] ?? 0

    return temp
  }, [data])

  const chartData = useMemo(() => {
    const temp = data?.data?.map(e => ({
      name: e.categoryName,
      amount: e.amount,
      used: e.used,
      percentage: (e.used / e.amount * 100).toFixed(1),
    }))

    temp?.sort((a, b) => b.percentage - a.percentage)

    console.log("chartdata", temp)

    return temp ?? []
  }, [data])

  const totalBudget = useMemo(() => {
    return R.sum(data?.data?.map(e => e.amount) ?? [0])
  }, [data])

  const totalSpending = useMemo(() => {
    return R.sum(data?.data?.map(e => e.used) ?? [0])
  }, [data])

  const budgetVariance = useMemo(() => {
    return totalBudget - totalSpending
  }, [totalBudget, totalSpending])

  const budgetEficiency = useMemo(() => {
    const total = data?.data?.length ?? 0
    const totalUnderspent = data?.data?.filter(e => e.used < e.amount)?.length ?? 0

    if (total == 0) {
      return 0
    }

    return (totalUnderspent / total * 100).toFixed(1)
  }, [data])

  const topOverspent = useMemo(() => {
    const temp = [...chartData].filter(e => parseFloat(e.percentage) >= 100)
    temp.sort((a, b) => b.percentage - a.percentage)

    return temp[0]?.name ?? "-"
  }, [chartData])

  const topUnderspent = useMemo(() => {
    const temp = [...chartData].filter(e => parseFloat(e.percentage) < 100)
    temp.sort((a, b) => a.percentage - b.percentage)

    return temp[0]?.name ?? "-"
  }, [chartData])

  return (
    <>
      <div className="flex size-full flex-col p-4">
        <form className="mb-4 grid w-full grid-cols-12 gap-2 md:gap-4">
          <Input
            aria-label="query"
            className="col-span-12 md:col-span-7"
            placeholder="Search..."
            size="md"
            startContent={<IconSearch className="size-4 stroke-gray-400 stroke-2" />}
            type="text"
            {...register("query")}
          />

          <Select
            aria-label="bulan"
            className="col-span-6 md:col-span-2"
            defaultSelectedKeys={[moment().format("M")]}
            size="md"
            {...register("month")}
          >
            {Array.from(Array(12).keys()).map(e => (
              <SelectItem key={`${e}`}>
                {moment().set("month", e).toDate().toLocaleDateString("id-ID", {
                  month: "long",
                })}
              </SelectItem>
            ))}
          </Select>

          <Select
            aria-label="tahun"
            className="col-span-6 md:col-span-2"
            defaultSelectedKeys={[moment().format("YYYY")]}
            size="md"
            {...register("year")}
          >
            {Array.from(Array(10).keys()).map((e) => {
              return (
                <SelectItem key={`${2024 + e}`} textValue={`${2024 + e}`}>
                  {2024 + e}
                </SelectItem>
              )
            })}
          </Select>

          <Button
            className="col-span-12 md:col-span-1"
            color="primary"
            onClick={handleSubmit(onSearch)}
            variant="bordered"
          >
            <div className="flex flex-row items-center">
              <IconSearch className="mr-2 size-4 stroke-2" />
              <p>Cari</p>
            </div>
          </Button>

        </form>

        <div className="mb-2 flex flex-row items-center justify-between">
          <p className="text-sm text-gray-600">
            {`Total ${data?.count ?? 0} anggaran`}
          </p>
          <div className="flex flex-row items-center">
            <div className="flex flex-row items-center">
              <div className="flex flex-row items-center">
                <span className="mr-2 text-sm text-gray-600">Baris</span>
                <Select aria-label="baris per halaman" className="min-w-20" onChange={e => setQueryParams("size", e.target.value)} selectedKeys={[queryParams.size.toString()]} size="sm">
                  <SelectItem key="10">
                    10
                  </SelectItem>
                  <SelectItem key="20">
                    20
                  </SelectItem>
                  <SelectItem key="30">
                    30
                  </SelectItem>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <BaseCard className="mb-4 flex h-[32rem] w-full flex-col p-4">
          <div className="flex h-full flex-row justify-start gap-4 overflow-x-scroll">
            {chartData?.map((e) => {
              return (
                <div className="flex flex-col items-center justify-start" key={e.name}>

                  <div className="flex h-full flex-row items-end gap-2">
                    <Tooltip content={(
                      <div className="flex flex-col">
                        <p className="mb-1">
                          {`${e.name} (Anggaran)`}
                        </p>
                        <p>{Utils.getIndonesianCurrency(e.amount)}</p>
                      </div>
                    )}
                    >
                      <div className="w-12 rounded-lg bg-blue-400" style={{ height: `${e.amount / highestAmount * 100}%` }}></div>
                    </Tooltip>
                    <Tooltip content={(
                      <div className="flex flex-col">
                        <p className="mb-1">
                          {`${e.name} (Pengeluaran)`}
                        </p>
                        <p>{Utils.getIndonesianCurrency(e.used)}</p>
                      </div>
                    )}
                    >
                      <div className="w-12 rounded-lg bg-orange-400" style={{ height: `${e.used / highestAmount * 100}%` }}></div>
                    </Tooltip>
                  </div>
                  <span className="mt-4 text-gray-700">{e.name.split(" ")[0]}</span>
                </div>
              )
            })}
          </div>
        </BaseCard>

        <div className="mb-4 grid grid-cols-12 gap-3">
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Jumlah Anggaran</span>
            <span className="text-xl font-medium text-gray-900">{Utils.getIndonesianCurrency(totalBudget ?? 0)}</span>
          </BaseCard>
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Jumlah Pengeluaran</span>
            <span className="text-xl font-medium text-gray-900">{Utils.getIndonesianCurrency(totalSpending ?? 0)}</span>
          </BaseCard>
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Variansi Anggaran</span>
            <span className="text-xl font-medium text-gray-900">{Utils.getIndonesianCurrency(budgetVariance ?? 0)}</span>
          </BaseCard>
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Efisiensi Anggaran</span>
            <span className="text-xl font-medium text-gray-900">{`${budgetEficiency}%`}</span>
          </BaseCard>
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Anggaran Melebihi Batas Teratas</span>
            <span className="text-xl font-medium text-gray-900">{topOverspent}</span>
          </BaseCard>
          <BaseCard className="col-span-12 flex flex-col p-4 md:col-span-4">
            <span className="mb-1 text-gray-600">Anggaran Batas Aman Teratas</span>
            <span className="text-xl font-medium text-gray-900">{topUnderspent}</span>
          </BaseCard>
        </div>

        <Table isStriped
          aria-label="Transaction table"
          bottomContent={
            pages > 0
              ? paginationElement
              : null
          }
          fullWidth
          isStriped
        >
          <TableHeader columns={columns}>
            {column => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody
            emptyContent={<div className="flex min-h-64 items-center justify-center">Empty!</div>}
            items={data?.data ?? []}
            loadingContent={<Spinner />}
            loadingState={loadingState}
          >
            {(item) => {
              return (
                <TableRow key={item.key}>
                  <TableCell className="w-full">{item.categoryName}</TableCell>
                  <TableCell className="min-w-32">{Utils.getIndonesianCurrency(item.amount)}</TableCell>
                  <TableCell className="min-w-32">{Utils.getIndonesianCurrency(item.used ?? 0)}</TableCell>
                  <TableCell className="min-w-32">{Utils.getIndonesianCurrency(item.amount - (item.used ?? 0))}</TableCell>
                  <TableCell>
                    <Chip color={`${item.used < item.amount ? "success" : "danger"}`} size="sm">{item.used < item.amount ? "Batas Aman" : "Melewati Batas"}</Chip>
                  </TableCell>
                  <TableCell className="min-w-[32rem]">
                    <div className="flex size-full flex-row items-center">
                      <div className="relative h-2 w-full">
                        <div className="absolute h-2 w-full rounded-full bg-gray-300"></div>
                        <div className={`absolute h-2 rounded-full ${item.used / item.amount >= 1 ? "bg-red-700" : "bg-blue-700"}`} style={{ width: `${Utils.coalesce(0, 100, item.used / item.amount * 100)}%` }}></div>
                      </div>
                      <span className="ml-4">
                        {(item.used / item.amount * 100).toFixed(1)}
                        %
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            }}
          </TableBody>
        </Table>
      </div>

    </>
  )
}

export default BudgetVsActualSpending

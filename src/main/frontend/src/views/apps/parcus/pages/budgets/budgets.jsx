import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, SelectItem, Select, Spinner, useDisclosure, DatePicker, DateInput, Divider } from "@nextui-org/react"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import { Controller, useForm } from "react-hook-form"
import useBudgetsViewModel from "./use_budgets_viewmodel"
import BudgetsFormModal from "./budgets_form_modal"
import BudgetsDeleteModal from "./budgets_delete_modal"
import moment from "moment"
import { parseAbsoluteToLocal, parseDate } from "@internationalized/date"
import Utils from "../../../../../utils"

const Budgets = () => {
  const {
    paginationElement,
    loadingState,
    pages,
    setHeldId,
    onDelete,
    onSubmit,
    data,
    queryParams,
    setQueryParams,
    onSearch,
  } = useBudgetsViewModel()

  const formDefaultValue = {
    id: "",
    date: parseAbsoluteToLocal(moment().format()),
    // categoryType: "",
    categoryId: "",
    // accountId: "",
    amount: 0,
    // description: "",
  }

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    reset: resetForm,
    watch: watchForm,
    control: controlForm,
  } = useForm({
    defaultValues: formDefaultValue,
  })

  const {
    isOpen: isOpenFormModal,
    onOpen: onOpenFormModal,
    onOpenChange: onOpenChangeFormModal,
  } = useDisclosure()

  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onOpenChange: onOpenChangeDeleteModal,
  } = useDisclosure()

  const {
    register,
    handleSubmit,
  } = useForm()

  const openModal = () => {
    resetForm(formDefaultValue)
    onOpenFormModal()
  }

  const openEditModal = (id) => {
    const target = structuredClone(data.data.filter(e => e.id == id)[0])
    target.date = parseAbsoluteToLocal(moment(target.date).format())

    resetForm(target)
    onOpenFormModal()
  }

  const openDeleteModal = (id) => {
    setHeldId(id)
    onOpenDeleteModal()
  }

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
      key: "usage",
      label: "PEMAKAIAN",
    },
    {
      key: "action",
      label: "AKSI",
    },
  ]

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
            <div className="mr-4 flex flex-row items-center">
              <div className="flex flex-row items-center gap-2">
                <span className="text-sm text-gray-600">Baris</span>
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
            <Button
              color="primary"
              onClick={openModal}
            >
              <div className="flex flex-row items-center">
                <IconPlus className="mr-2 size-5 stroke-2" />
                <p>Tambah</p>
              </div>
            </Button>
          </div>
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
                  <TableCell>{Utils.getIndonesianCurrency(item.amount)}</TableCell>
                  <TableCell>{Utils.getIndonesianCurrency(item.used ?? 0)}</TableCell>
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
                  <TableCell className="min-w-48">
                    <Button
                      className="mr-2"
                      color="default"
                      onClick={() => openEditModal(item.id)}
                      size="sm"
                    >
                      Ubah
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => openDeleteModal(item.id)}
                      size="sm"
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              )
            }}
          </TableBody>
        </Table>
      </div>

      <BudgetsFormModal
        control={controlForm}
        errors={errorsForm}
        isOpen={isOpenFormModal}
        onOpenChange={onOpenChangeFormModal}
        onSubmit={onClose => handleSubmitForm(data => onSubmit(onClose, data))}
        register={registerForm}
        watch={watchForm}
      />

      <BudgetsDeleteModal
        isOpen={isOpenDeleteModal}
        onDelete={onDelete}
        onOpenChange={onOpenChangeDeleteModal}
      />
    </>
  )
}

export default Budgets

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, SelectItem, Select, Spinner, useDisclosure } from "@nextui-org/react"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import useRecurringTransactionsViewModel from "./use_recurring_transactions_viewmodel"
import { useForm } from "react-hook-form"
import RecurringTransactionsFormModal from "./recurring_transactions_form_modal"
import RecurringTransactionsDeleteModal from "./recurring_transactions_delete_modal"
import { parseAbsoluteToLocal } from "@internationalized/date"
import moment from "moment"
import Utils from "../../../../../utils"

const RecurringTransactions = () => {
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
  } = useRecurringTransactionsViewModel()

  const formDefaultValue = {
    id: "",
    name: "",
    categoryId: "",
    frequency: "",
    amount: 0,
    startAt: parseAbsoluteToLocal(moment().format()),
    nextDueAt: parseAbsoluteToLocal(moment().format()),
  }

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    reset: resetForm,
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

    target.startAt = parseAbsoluteToLocal(moment(target.startAt).format())
    target.nextDueAt = parseAbsoluteToLocal(moment(target.nextDueAt).format())

    resetForm(target)
    onOpenFormModal()
  }

  const openDeleteModal = (id) => {
    setHeldId(id)
    onOpenDeleteModal()
  }

  const columns = [
    {
      key: "name",
      label: "NAMA",
    },
    {
      key: "categoryName",
      label: "KATEGORI",
    },
    {
      key: "startAt",
      label: "TANGGAL AWAL",
    },
    {
      key: "nextDueAt",
      label: "TANGGAL SELANJUTNYA",
    },
    {
      key: "frequency",
      label: "FREKUENSI",
    },
    {
      key: "amount",
      label: "JUMLAH",
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
            className="col-span-12 md:col-span-11"
            placeholder="Query..."
            size="md"
            startContent={<IconSearch className="size-4 stroke-gray-400 stroke-2" />}
            type="text"
            {...register("query")}
          />

          <Button
            className="col-span-12 md:col-span-1"
            color="primary"
            onClick={handleSubmit(onSearch)}
            size="md"
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
            {`Total ${data?.count ?? 0} transaksi berulang`}
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

        <Table
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
                  <TableCell className="w-full">{item.name}</TableCell>
                  <TableCell className="min-w-48">{item.categoryName}</TableCell>
                  <TableCell className="min-w-48">{Utils.getLocaleDate(moment(item.startAt).toDate())}</TableCell>
                  <TableCell className="min-w-48">{Utils.getLocaleDate(moment(item.nextDueAt).toDate())}</TableCell>
                  <TableCell className="min-w-24">{Utils.getFrequencyValue(item.frequency)}</TableCell>
                  <TableCell className="min-w-48">{Utils.getIndonesianCurrency(item.amount)}</TableCell>
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

      <RecurringTransactionsFormModal
        control={controlForm}
        errors={errorsForm}
        isOpen={isOpenFormModal}
        onOpenChange={onOpenChangeFormModal}
        onSubmit={onClose => handleSubmitForm(data => onSubmit(onClose, data))}
        register={registerForm}
      />

      <RecurringTransactionsDeleteModal
        isOpen={isOpenDeleteModal}
        onDelete={onDelete}
        onOpenChange={onOpenChangeDeleteModal}
      />
    </>
  )
}

export default RecurringTransactions

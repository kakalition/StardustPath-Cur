import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, SelectItem, Select, Spinner, useDisclosure } from "@nextui-org/react"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import useAccountsViewModel from "./use_accounts_viewmodel"
import { useForm } from "react-hook-form"
import AccountsFormModal from "./accounts_form_modal"
import AccountsDeleteModal from "./accounts_delete_modal"

const Accounts = () => {
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
  } = useAccountsViewModel()

  const formDefaultValue = {
    id: "",
    emoji: "",
    name: "",
  }

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    reset: resetForm,
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
    const target = data.data.filter(e => e.id == id)[0]
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
      key: "note",
      label: "DESKRIPSI",
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
            {`Total ${data?.count ?? 0} dompet`}
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
                  <TableCell className="w-full min-w-48">{`${item.emoji} ${item.name}`}</TableCell>
                  <TableCell className="min-w-96">{item.note}</TableCell>
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

      <AccountsFormModal
        errors={errorsForm}
        isOpen={isOpenFormModal}
        onOpenChange={onOpenChangeFormModal}
        onSubmit={onClose => handleSubmitForm(data => onSubmit(onClose, data))}
        register={registerForm}
      />
      <AccountsDeleteModal
        isOpen={isOpenDeleteModal}
        onDelete={onDelete}
        onOpenChange={onOpenChangeDeleteModal}
      />
    </>
  )
}

export default Accounts

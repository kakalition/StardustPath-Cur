import { SelectItem, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Select, Spinner, Table, TableColumn, useDisclosure, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip, Textarea } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { TableBody, TableHeader } from "react-stately"
import Utils from "../../../../../utils"
import useSWR from "swr"
import { useMemo, useState } from "react"
import API from "../../../../../common/api"
import TypeCollection from "../../../../../common/type_collection"
import TypeCollectionJSX from "../../../../../common/type_collection_jsx"
import moment from "moment"
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"

const Reminders = () => {
  const [heldId, setHeldId] = useState(null)

  const [page, setPage] = useState(0)
  const { data, isLoading, mutate } = useSWR(
    [API.Reminders.getUrl, { page, size: 20 }],
    Utils.fetcher,
    {
      keepPreviousData: true,
    },
  )

  const pages = useMemo(() => data?.count ? Math.ceil(data.count / 20) : 0, [data?.count, 20])

  const {
    isOpen: isOpenFormModal,
    onOpen: onOpenFormModal,
    onOpenChange: onOpenChangeFormModal,
  } = useDisclosure()

  const {
    isOpen: isOpenConfirmationModal,
    onOpen: onOpenConfirmationModal,
    onOpenChange: onOpenChangeConfirmationModal,
  } = useDisclosure()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      date: moment().format("yyyy-MM-DD"),
      recurrence: "",
    },
  })

  const PaginationElement = (
    <div className="flex w-full justify-center">
      <Pagination
        color="primary"
        isCompact
        onChange={page => setPage(page - 1)}
        page={page + 1}
        showControls
        showShadow
        total={pages}
      />
    </div>
  )

  function onNew() {
    setHeldId(null)
    reset()
    onOpenFormModal()
  }

  async function onEdit(data) {
    setHeldId(data.id)

    reset({
      title: data.title,
      description: data.description,
      date: data.date,
      recurrence: data.recurrence,
    })

    onOpenFormModal()
  }

  async function onDelete(data) {
    setHeldId(data.id)
    onOpenConfirmationModal()
  }

  async function submitDeletion(onCloseModal) {
    try {
      await API.Reminders.delete(heldId)

      mutate()
      onCloseModal()
    }
    catch (ex) {
      console.error("Error in delete asset item", ex)
    }
  }

  async function submitReminder(onCloseModal, data) {
    try {
      if (heldId != null) {
        await API.Reminders.put(heldId, data)
      }
      else {
        await API.Reminders.post(data)
      }

      mutate()
      onCloseModal()
    }
    catch (ex) {
      console.error("Error in submit asset item", ex)
    }
  }

  return (
    <>
      <div className="flex min-w-full flex-col gap-4 p-4">
        <div className="flex flex-row justify-end">
          <Button color="primary" onClick={onNew}>Tambah</Button>
        </div>
        <Table
          aria-label="Example static collection table"
          bottomContent={pages > 0 ? PaginationElement : null}
          isStriped
        >
          <TableHeader>
            <TableColumn>JUDUL</TableColumn>
            <TableColumn>DESKRIPSI</TableColumn>
            <TableColumn>PENGULANGAN</TableColumn>
            <TableColumn>TANGGAL PENGINGAT BERIKUTNYA</TableColumn>
            <TableColumn width={20}></TableColumn>
          </TableHeader>
          <TableBody>
            {/* {item => (
              <TableRow>
                <TableCell>{item.assetItemName}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
                    {TypeCollectionJSX.getAssetTypeIcon(item.assetItemType, 20)}
                    {TypeCollection.getAssetTypeNameByKey(item.assetItemType)}
                  </div>
                </TableCell>
                <TableCell align="end">{item.quantity}</TableCell>
                <TableCell align="end">{Utils.getIndonesianCurrency(item.price)}</TableCell>
                <TableCell align="end">{Utils.getIndonesianCurrency(item.quantity * item.price)}</TableCell>
                <TableCell align="center">
                  {item.transactionType == "BUY" ? <Chip color="success" variant="flat">Pembelian</Chip> : <Chip color="danger" variant="flat">Penjualan</Chip> }
                </TableCell>
                <TableCell>{moment(item.date).format("DD/MM/yyyy")}</TableCell>
                <TableCell>{moment(item.updatedAt).format("DD/MM/yyyy HH:mm")}</TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly variant="light"><IconDotsVertical /></Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem onClick={() => onEdit(item)} startContent={<IconEdit />}>Edit</DropdownItem>
                      <DropdownItem color="danger" onClick={() => onDelete(item)} startContent={<IconTrash />}>Hapus</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isOpenFormModal} onOpenChange={onOpenChangeFormModal}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Form
                {heldId ? " Update " : " Tambah "}
                Reminder
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    {...register("title", { required: "Judul wajib diisi." })}
                    errorMessage={errors?.title?.message}
                    isInvalid={errors?.title != null}
                    isRequired
                    label="Judul"
                    placeholder="Masukkan judul reminder"
                    type="text"
                  />
                  <Textarea
                    {...register("description", { required: "Deskripsi wajib diisi." })}
                    errorMessage={errors?.description?.message}
                    isInvalid={errors?.description != null}
                    isRequired
                    label="Deskripsi"
                    placeholder="Masukkan deskripsi reminder"
                  />
                  <Select
                    errorMessage={errors?.type?.message}
                    isInvalid={errors?.type != null}
                    isRequired
                    label="Prioritas"
                    {...register("prioritization", { required: "Prioritas wajib diisi." })}
                  >
                    {TypeCollection.prioritization.map(e => (
                      <SelectItem key={e.key}>
                        {e.value}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    errorMessage={errors?.type?.message}
                    isInvalid={errors?.type != null}
                    isRequired
                    label="Pengulangan"
                    {...register("recurrence", { required: "Pengulangan wajib diisi." })}
                  >
                    {TypeCollection.recurrences.map(e => (
                      <SelectItem key={e.key}>
                        {e.value}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    {...register("date", { required: "Tangal wajib diisi." })}
                    errorMessage={errors?.date?.message}
                    isInvalid={errors?.date != null}
                    isRequired
                    label="Tanggal Reminder Berikutnya"
                    placeholder="Masukkan tangal reminder"
                    type="date"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose} variant="light">
                  Batal
                </Button>
                <Button color="primary" onPress={handleSubmit(data => submitReminder(onClose, data))}>
                  {heldId ? "Update" : "Tambah"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenConfirmationModal} onOpenChange={onOpenChangeConfirmationModal}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">Konfirmasi Penghapusan Reminder</ModalHeader>
              <ModalBody>
                <p>Apakah Anda yakin ingin menghapus item ini? Item yang sudah dihapus tidak bisa dikembalikan.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose} variant="light">
                  Batal
                </Button>
                <Button color="danger" onPress={() => submitDeletion(onClose)}>
                  Hapus
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default Reminders

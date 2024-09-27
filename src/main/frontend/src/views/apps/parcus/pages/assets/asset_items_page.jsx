import { SelectItem, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Select, Spinner, Table, TableColumn, useDisclosure, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { TableBody, TableHeader } from "react-stately"
import Utils from "../../../../../utils"
import useSWR from "swr"
import { useMemo, useState } from "react"
import API from "../../../../../common/api"
import TypeCollection from "../../../../../common/type_collection"
import moment from "moment"
import TypeCollectionJSX from "../../../../../common/type_collection_jsx"
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"

function AssetItemsPage() {
  const [heldId, setHeldId] = useState(null)

  const [page, setPage] = useState(0)
  const { data, isLoading, mutate } = useSWR(
    [`${import.meta.env.VITE_BASE_API_URL}/api/assets/items`, { page, size: 20 }],
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
      name: "",
      symbol: "",
      type: "",
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
    onOpenFormModal()
  }

  async function onEdit(data) {
    setHeldId(data.id)

    reset({
      name: data.name,
      symbol: data.symbol,
      type: data.type,
    })

    onOpenFormModal()
  }

  async function onDelete(data) {
    setHeldId(data.id)
    onOpenConfirmationModal()
  }

  async function submitDeletion(onCloseModal) {
    try {
      await API.deleteAssetItem(heldId)

      mutate()
      onCloseModal()
    }
    catch (ex) {
      console.error("Error in delete asset item", ex)
    }
  }

  async function submitAssetItem(onCloseModal, data) {
    try {
      if (heldId != null) {
        await API.putAssetItem(heldId, data)
      }
      else {
        await API.postAssetItem(data)
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
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-end">
          <Button color="primary" onClick={onNew}>Tambah</Button>
        </div>
        <Table
          aria-label="Example static collection table"
          bottomContent={pages > 0 ? PaginationElement : null}
          isStriped
        >
          <TableHeader>
            <TableColumn>NAMA</TableColumn>
            <TableColumn>SIMBOL</TableColumn>
            <TableColumn>TIPE ASSET</TableColumn>
            <TableColumn>TERAKHIR UPDATE</TableColumn>
            <TableColumn width={20}></TableColumn>
          </TableHeader>
          <TableBody
            items={data?.data ?? []}
            loadingContent={<Spinner />}
            loadingState={isLoading ? "loading" : "idle"}
          >
            {item => (
              <TableRow>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.symbol}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
                    {TypeCollectionJSX.getAssetTypeIcon(item.type, 20)}
                    {TypeCollection.getAssetTypeNameByKey(item.type)}
                  </div>
                </TableCell>
                <TableCell>{moment(item.updatedAt).format("yyyy-MM-DD HH:mm")}</TableCell>
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
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isOpenFormModal} onOpenChange={onOpenChangeFormModal}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">Form Daftar Asset</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    {...register("name", { required: "Nama wajib diisi." })}
                    errorMessage={errors?.name?.message}
                    isInvalid={errors?.name != null}
                    isRequired
                    label="Nama"
                    placeholder="Masukkan nama asset"
                    type="text"
                  />
                  <Input
                    {...register("symbol", { required: "Simbol wajib diisi." })}
                    errorMessage={errors?.symbol?.message}
                    isInvalid={errors?.symbol != null}
                    isRequired
                    label="Simbol"
                    placeholder="Masukkan simbol asset"
                    type="text"
                  />
                  <Select
                    errorMessage={errors?.type?.message}
                    isInvalid={errors?.type != null}
                    isRequired
                    label="Jenis Asset"
                    {...register("type", { required: "Jenis asset wajib diisi." })}
                  >
                    {TypeCollection.assetTypes.map(e => (
                      <SelectItem key={e.key}>
                        {e.value}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose} variant="light">
                  Batal
                </Button>
                <Button color="primary" onPress={handleSubmit(data => submitAssetItem(onClose, data))}>
                  Tambah
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
              <ModalHeader className="flex flex-col gap-1">Konfirmasi Penghapusan Asset</ModalHeader>
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

export default AssetItemsPage

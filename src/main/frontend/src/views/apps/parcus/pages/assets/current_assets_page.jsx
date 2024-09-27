import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Table, TableCell, TableColumn, TableRow, useDisclosure } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { TableBody, TableHeader } from "react-stately"
import Utils from "../../../../../utils"
import useSWR from "swr"
import moment from "moment"
import TypeCollectionJSX from "../../../../../common/type_collection_jsx"
import TypeCollection from "../../../../../common/type_collection"
import BaseCard from "../../components/base_card"
import { Item, Menu, Separator, Submenu, useContextMenu } from "react-contexify"
import { IconCoin, IconDotsVertical, IconMoneybag } from "@tabler/icons-react"
import { useMemo, useState } from "react"
import axios from "axios"
import API from "../../../../../common/api"

const MENU_ID = "menu-id"

function CurrentAssetsPage() {
  const [currentContext, setCurrentContext] = useState(null)

  const { show } = useContextMenu({
    id: MENU_ID,
  })

  const {
    isOpen: isOpenFormModal,
    onOpen: onOpenFormModal,
    onOpenChange: onOpenChangeFormModal,
  } = useDisclosure()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      date: moment().format("yyyy-MM-DD"),
      quantity: 0,
      price: 0,
      averageBuyPrice: 0,
      sellingFee: 0,
    },
  })

  function displayMenu(e, item) {
    setCurrentContext(item)
    show({ event: e })
  }

  const { data, mutate } = useSWR([`${import.meta.env.VITE_BASE_API_URL}/api/assets/current`, {}], Utils.fetcher, {
    keepPreviousData: true,
  })

  function onContextSellAsset() {
    reset()
    onOpenFormModal()
  }

  async function onSellAsset(onClose, data) {
    await API.AssetTransactions.post({
      ...data,
      sellingFee: parseFloat(data.sellingFee),
      transactionType: "SELL",
      assetItemId: currentContext.id,
      averageBuyPrice: currentContext.averagePrice,
    })

    reset()
    mutate()
    onClose()
  }

  const sellPrice = watch("price")
  const sellQuantity = watch("quantity")
  const sellingFee = watch("sellingFee")
  const profitLossValue = useMemo(() => {
    return Math.round(((sellPrice - (currentContext?.averagePrice ?? 0)) * sellQuantity) - sellingFee)
  }, [sellPrice, sellQuantity, sellingFee])

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-4 grid grid-cols-12 gap-4">
        {TypeCollection.assetTypes.map((e) => {
          return (
            <BaseCard className="col-span-3 p-8" key={e.key}>
              {TypeCollectionJSX.getAssetTypeIcon(e.key, 64, "stroke-gray-800")}
              <div className="h-8" />
              <p className="mb-1 text-lg font-medium text-gray-700">{e.value}</p>
              <p className="text-2xl font-medium">{Utils.getIndonesianCurrency(data?.typeDistribution?.[e.key] ?? 0)}</p>
            </BaseCard>
          )
        })}
      </div>

      <Table aria-label="Example static collection table" isStriped>
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>QUANTITY</TableColumn>
          <TableColumn>AVG PRICE</TableColumn>
          <TableColumn>TOTAL</TableColumn>
          <TableColumn>LAST UPDATED</TableColumn>
          <TableColumn></TableColumn>
        </TableHeader>
        <TableBody items={data?.data ?? []}>
          {item => (
            <TableRow className="cursor-pointer" onContextMenu={e => displayMenu(e, item)}>
              <TableCell>
                <p className="py-2">{item.assetItemName}</p>
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-2">
                  {TypeCollectionJSX.getAssetTypeIcon(item.assetItemType, 20)}
                  {TypeCollection.getAssetTypeNameByKey(item.assetItemType)}
                </div>
              </TableCell>
              <TableCell align="end">{item.quantity}</TableCell>
              <TableCell align="end">{Utils.getIndonesianCurrency(item.averagePrice)}</TableCell>
              <TableCell align="end">{Utils.getIndonesianCurrency(item.totalBought)}</TableCell>
              <TableCell>{moment(item.updatedAt).format("yyyy-MM-DD HH:mm")}</TableCell>
              <TableCell width={10}>
                <div className="rounded-full p-2 transition hover:bg-gray-200">
                  <IconDotsVertical className="" onClick={e => displayMenu(e, item)} />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpenFormModal} onOpenChange={onOpenChangeFormModal}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">Form Jual Asset</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    {...register("date", { required: "Tangal wajib diisi." })}
                    errorMessage={errors?.date?.message}
                    isInvalid={errors?.date != null}
                    isRequired
                    label="Tanggal Penjualan"
                    placeholder="Masukkan tangal penjualan"
                    type="date"
                  />
                  <Input
                    isReadOnly
                    label="Nama Asset"
                    type="text"
                    value={currentContext.assetItemName}
                  />
                  <Input
                    isReadOnly
                    label="Jenis Asset"
                    type="text"
                    value={TypeCollection.getAssetTypeNameByKey(currentContext.assetItemType)}
                  />
                  <Input
                    isReadOnly
                    label="Jumlah Dimiliki"
                    type="number"
                    value={currentContext.quantity}
                  />
                  <Input
                    {...register("quantity", { required: "Jumlah wajib diisi." })}
                    errorMessage={errors?.quantity?.message}
                    isInvalid={errors?.quantity != null}
                    isRequired
                    label="Jumlah"
                    placeholder="Masukkan jumlah penjualan"
                    type="number"
                  />
                  <Input
                    isReadOnly
                    label="Rata-rata Harga Beli"
                    type="text"
                    value={Utils.getIndonesianCurrency(currentContext.averagePrice)}
                  />
                  <Input
                    {...register("price", { required: "Harga wajib diisi." })}
                    errorMessage={errors?.price?.message}
                    isInvalid={errors?.price != null}
                    isRequired
                    label="Harga per Item"
                    placeholder="Masukkan harga per item penjualan"
                    type="number"
                  />
                  <Input
                    {...register("sellingFee", { required: "Fee penjualan wajib diisi." })}
                    errorMessage={errors?.sellingFee?.message}
                    isInvalid={errors?.sellingFee != null}
                    isRequired
                    label="Fee Penjualan"
                    placeholder="Masukkan fee penjualan"
                    type="number"
                  />
                  <Input
                    color={profitLossValue < 0 ? "danger" : "success"}
                    isReadOnly
                    label="Profit/Loss"
                    type="text"
                    value={Utils.getIndonesianCurrency(profitLossValue)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose} variant="light">
                  Batal
                </Button>
                <Button color="primary" onClick={handleSubmit(data => onSellAsset(onClose, data))}>
                  Jual
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Menu id={MENU_ID}>
        <Item onClick={onContextSellAsset}>
          <div className="flex flex-row gap-2 stroke-gray-800 text-gray-800">
            <IconCoin className="stroke-[2px]" />
            Sell Asset
          </div>
        </Item>
      </Menu>
    </div>
  )
}

export default CurrentAssetsPage

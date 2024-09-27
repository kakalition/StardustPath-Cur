import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, SelectItem, Select, Textarea, DatePicker } from "@nextui-org/react"
import { IconAlertCircle } from "@tabler/icons-react"
import axios from "axios"
import moment from "moment"
import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"

function TransactionsFormModal({ isOpen, onOpenChange, onSubmit, register, errors, watch, control }) {
  const [categories, setCategories] = useState([])
  const [activeCategories, setActiveCategories] = useState([])

  const [budget, setBudget] = useState(null)
  const [showAlert, setShowAlert] = useState(false)

  const categoryTypeValue = watch("categoryType")
  const categoryValue = watch("categoryId")
  const dateValue = watch("date")
  const amountValue = watch("amount")

  useEffect(() => {
    setActiveCategories(categories.filter(e => e.extra == categoryTypeValue))
  }, [categoryValue, categoryTypeValue])

  useEffect(() => {
    getAndSetBudget(categoryValue, moment(dateValue.toString().replace(/[[].+[\]]/, "")).format("YYYY-MM"))
  }, [categoryValue, dateValue])

  useEffect(() => {
    if (budget == null) {
      setShowAlert(false)
      return
    }

    setShowAlert(budget.used + parseFloat(amountValue) > budget.amount)
  }, [amountValue, budget])

  const getAndSetBudget = async (categoryId, period) => {
    const date = period.split("-")

    const output = await axios({
      url: `${import.meta.env.VITE_BASE_API_URL}/api/budgets/${categoryId}/${date[0]}/${(date[1]).toString().padStart(2, "0")}`,
      method: "GET",
      withCredentials: true,
    })

    setBudget(output.data)
  }

  const fetchFormDropdowns = async () => {
    const categories = (await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/auto/categories`, { withCredentials: true })).data
    setCategories(categories)
    setActiveCategories(categories)
  }

  useEffect(() => {
    fetchFormDropdowns()
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {onClose => (
          <form onSubmit={onSubmit(onClose)}>
            <ModalHeader className="flex flex-col gap-1">Form Transaksi</ModalHeader>
            <ModalBody>
              <input
                type="hidden"
                {...register("id")}
              />

              <Controller
                control={control}
                name="date"
                render={({ field }) => {
                  return (
                    <DatePicker
                      errorMessage={errors.date?.message}
                      granularity="minute"
                      isInvalid={errors.date != null}
                      isRequired
                      label="Tanggal"
                      {...field}
                    />
                  )
                }}
                rules={({ required: "Tanggal wajib diisi" })}
              />

              <Select
                errorMessage={errors.categoryType?.message}
                isInvalid={errors.categoryType != null}
                isRequired
                label="Jenis"
                placeholder="Jenis kategori"
                {...register("categoryType", { required: "Jenis wajib diisi." })}
              >
                <SelectItem key="EXPENSE">
                  Pengeluaran
                </SelectItem>
                <SelectItem key="INCOME">
                  Pemasukan
                </SelectItem>
              </Select>

              <Select
                errorMessage={errors.categoryId?.message}
                isInvalid={errors.categoryId != null}
                isRequired
                items={activeCategories}
                label="Kategori"
                {...register("categoryId", { required: "Kategori wajib diisi." })}
              >
                {item => (
                  <SelectItem key={item.id}>{item.name}</SelectItem>
                )}
              </Select>

              {/* <Select
                errorMessage={errors.accountId?.message}
                isInvalid={errors.accountId != null}
                isRequired
                items={accounts}
                label="Dompet"
                {...register("accountId", { required: "Dompet wajib diisi." })}
              >
                {item => (
                  <SelectItem key={item.id}>{item.name}</SelectItem>
                )}
              </Select> */}

              <Input
                errorMessage={errors.amount?.message}
                isInvalid={errors.amount != null}
                isRequired
                label="Jumlah"
                placeholder="Masukkan jumlah"
                type="number"
                {...register("amount", { required: "Jumlah wajib diisi." })}
              />

              <div className={`flex flex-row rounded-lg bg-red-50 p-2 ${showAlert ? "flex" : "hidden"}`}>
                <IconAlertCircle className="stroke-gray-700 stroke-[3]" />
                <span className="ml-2 text-sm text-gray-700">Jumlah uang yang dikeluarkan akan melebihi anggaran!</span>
              </div>

              <Select
                errorMessage={errors.isRecurring?.message}
                isInvalid={errors.isRecurring != null}
                isRequired
                label="Transaksi Berulang"
                placeholder="Transaksi berulang"
                {...register("isRecurring", { required: "Transaksi berulang wajib diisi." })}
              >
                <SelectItem key={false}>
                  Tidak
                </SelectItem>
                <SelectItem key={true}>
                  Ya
                </SelectItem>
              </Select>

              <Textarea
                isRequired
                label="Deskripsi"
                placeholder="Masukkan deskripsi"
                {...register("note", { required: "Deskripsi wajib diisi." })}
                errorMessage={errors.note?.message}
                isInvalid={errors.note != null}
              />

            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                onPress={onClose}
                variant="light"
              >
                Batal
              </Button>
              <Button
                color="primary"
                type="submit"
              >
                Simpan
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}

export default TransactionsFormModal

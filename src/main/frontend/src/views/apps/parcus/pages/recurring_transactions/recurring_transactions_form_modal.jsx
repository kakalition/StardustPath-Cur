import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, SelectItem, Select, Textarea, DatePicker } from "@nextui-org/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"

function RecurringTransactionsFormModal({ isOpen, onOpenChange, onSubmit, register, errors, control }) {
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])

  const fetchFormDropdowns = async () => {
    const categories = (await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/auto/categories?type=EXPENSE`, { withCredentials: true })).data
    setCategories(categories)

    // const accounts = (await axios.get(`${import.meta.env.VITE_BASE_API_URL}/auto/accounts`, { withCredentials: true })).data
    // setAccounts(accounts)
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
            <ModalHeader className="flex flex-col gap-1">Form Transaksi Berulang</ModalHeader>
            <ModalBody>
              <input
                type="hidden"
                {...register("id")}
              />

              <Input
                errorMessage={errors.name?.message}
                isInvalid={errors.name != null}
                isRequired
                label="Nama"
                type="text"
                {...register("name", { required: "Nama wajib diisi." })}
              />

              <Select
                errorMessage={errors.categoryId?.message}
                isInvalid={errors.categoryId != null}
                isRequired
                items={categories}
                label="Kategori"
                {...register("categoryId", { required: "Kategori wajib diisi." })}
              >
                {item => (
                  <SelectItem key={item.id}>{item.name}</SelectItem>
                )}
              </Select>

              <Select
                errorMessage={errors.frequency?.message}
                isInvalid={errors.frequency != null}
                isRequired
                label="Frekuensi"
                {...register("frequency", { required: "Frekuensi wajib diisi." })}
              >
                <SelectItem key="WEEKLY">Mingguan</SelectItem>
                <SelectItem key="MONTHLY">Bulanan</SelectItem>
                <SelectItem key="YEARLY">Tahunan</SelectItem>
              </Select>

              <Controller
                control={control}
                name="startAt"
                render={({ field }) => {
                  return (
                    <DatePicker
                      errorMessage={errors.startAt?.message}
                      granularity="day"
                      isInvalid={errors.startAt != null}
                      isRequired
                      label="Tanggal Awal"
                      {...field}
                    />
                  )
                }}
                rules={({ required: "Tanggal awal wajib diisi" })}
              />

              <Controller
                control={control}
                name="nextDueAt"
                render={({ field }) => {
                  return (
                    <DatePicker
                      errorMessage={errors.nextDueAt?.message}
                      granularity="day"
                      isInvalid={errors.nextDueAt != null}
                      isRequired
                      label="Tanggal Pembayaran Selanjutnya"
                      {...field}
                    />
                  )
                }}
                rules={({ required: "Tanggal pembayaran selanjutnya wajib diisi" })}
              />

              <Input
                errorMessage={errors.amount?.message}
                isInvalid={errors.amount != null}
                isRequired
                label="Jumlah"
                type="number"
                {...register("amount", { required: "Jumlah wajib diisi." })}
              />

              {/* <Textarea
                errorMessage={errors.note?.message}
                isInvalid={errors.note != null}
                isRequired
                label="Deskripsi"
                {...register("note", { required: "Deskripsi wajib diisi." })}
              /> */}
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

export default RecurringTransactionsFormModal

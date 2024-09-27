import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, SelectItem, Select, Textarea, DatePicker } from "@nextui-org/react"
import axios from "axios"
import moment from "moment"
import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"

function BudgetsFormModal({ isOpen, onOpenChange, onSubmit, register, errors }) {
  const [categories, setCategories] = useState([])

  const fetchFormDropdowns = async () => {
    const categories = (await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/auto/categories?type=EXPENSE`, { withCredentials: true })).data
    setCategories(categories)
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
            <ModalHeader className="flex flex-col gap-1">Form Anggaran</ModalHeader>
            <ModalBody>
              <input
                type="hidden"
                {...register("id")}
              />

              <Select
                className="col-span-6 md:col-span-2"
                defaultSelectedKeys={[moment().format("YYYY")]}
                label="Tahun"
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

              <Select
                className="col-span-6 md:col-span-2"
                defaultSelectedKeys={[moment().format("M")]}
                label="Bulan"
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

              <Input
                errorMessage={errors.amount?.message}
                isInvalid={errors.amount != null}
                isRequired
                label="Jumlah"
                placeholder="Masukkan jumlah"
                type="text"
                {...register("amount", { required: "Jumlah wajib diisi." })}
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

export default BudgetsFormModal

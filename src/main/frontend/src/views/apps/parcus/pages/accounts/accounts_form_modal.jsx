import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea } from "@nextui-org/react"

function AccountsFormModal({ isOpen, onOpenChange, onSubmit, register, errors }) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {onClose => (
          <form onSubmit={onSubmit(onClose)}>
            <ModalHeader className="flex flex-col gap-1">Form Dompet</ModalHeader>
            <ModalBody>
              <input
                type="hidden"
                {...register("id")}
              />
              <Input
                errorMessage={errors.emoji?.message}
                isInvalid={errors.emoji != null}
                isRequired
                label="Emoji"
                placeholder="Masukkan emoji"
                type="text"
                {...register("emoji", { required: "Emoji wajib diisi." })}
              />
              <Input
                errorMessage={errors.name?.message}
                isInvalid={errors.name != null}
                isRequired
                label="Nama"
                placeholder="Masukkan nama"
                type="text"
                {...register("name", { required: "Nama wajib diisi." })}
              />
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

export default AccountsFormModal

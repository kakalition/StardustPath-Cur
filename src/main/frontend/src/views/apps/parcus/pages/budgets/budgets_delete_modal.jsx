import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react"

function BudgetsDeleteModal({ isOpen, onOpenChange, onDelete }) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">Hapus Kategori</ModalHeader>
            <ModalBody>
              <p>Apakah Anda yakin ingin menghapus kategori ini? Aksi ini tidak bisa dibatalkan.</p>
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
                color="danger"
                onClick={() => onDelete(onClose)}
              >
                Hapus
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default BudgetsDeleteModal

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"

function SettingsModal({ isOpen, onOpenChange }) {
  return (
    <Modal className="bg-gray-200 p-0" hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent className="p-0">
        {onClose => (
          <>
            {/* <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader> */}
            <ModalBody>
              <div className="flex flex-row">
                <div className="w-1/5 bg-gray-200">
                  Side
                </div>
                <div className="w-4/5 bg-white">
                  Main
                </div>
              </div>
            </ModalBody>
            {/* <ModalFooter>
              <Button color="danger" onPress={onClose} variant="light">
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter> */}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default SettingsModal

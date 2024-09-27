import ParcusLogo from "../../../../assets/parcus.png"
import { IconChartLine, IconChartCohort, IconHome, IconX, IconReceipt, IconCategory, IconRepeat, IconCards, IconChartBar, IconCoins, IconListCheck } from "@tabler/icons-react"
import { useLocation, useNavigate } from "react-router-dom"
import CategoryTile from "./category_tile"
import { Avatar, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@nextui-org/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import Utils from "../../../../utils"

function SidebarContent({ hideSidebar, setHideSidebar, onLogout, authInfo, onSubmitProfilePicture }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    register,
    handleSubmit,
  } = useForm()

  const [popoverOpen, setPopoverOpen] = useState(false)

  const navigate = useNavigate()

  const handleNavigation = (path) => {
    setHideSidebar(window.innerWidth < 1280)
    navigate(path)
  }

  const location = useLocation().pathname.replace("/", "")

  const menus = [
    {
      icon: <IconChartLine className="size-6 stroke-gray-600 stroke-2" />,
      location: "net-worth-trends",
    },
    {
      icon: <IconChartLine className="size-6 stroke-gray-600 stroke-2" />,
      location: "income-and-expense-trends",
    },
    {
      icon: <IconChartLine className="size-6 stroke-gray-600 stroke-2" />,
      location: "spending-by-category",
    },
    {
      icon: <IconChartLine className="size-6 stroke-gray-600 stroke-2" />,
      location: "expense-ratio",
    },
    {
      icon: <IconChartLine className="size-6 stroke-gray-600 stroke-2" />,
      location: "savings-rate-trend",
    },
    {
      icon: <IconChartBar className="size-6 stroke-gray-600 stroke-2" />,
      location: "income-vs-expense-over-time",
    },
    {
      icon: <IconChartBar className="size-6 stroke-gray-600 stroke-2" />,
      location: "recurring-vs-one-time-expenses",
    },
    {
      icon: <IconChartBar className="size-6 stroke-gray-600 stroke-2" />,
      location: "weekday-vs-weekend-spending",
    },
    {
      icon: <IconChartCohort className="size-6 stroke-gray-600 stroke-2" />,
      location: "expenses-by-day-of-the-week-and-time-of-the-day",
    },
    {
      icon: <IconChartCohort className="size-6 stroke-gray-600 stroke-2" />,
      location: "daily-spending-heat-map",
    },
    {
      icon: <IconChartCohort className="size-6 stroke-gray-600 stroke-2" />,
      location: "hourly-spending-heat-map",
    },
    {
      icon: <IconChartLine className="size-6 stroke-gray-600 stroke-2" />,
      location: "budget-vs-actual-spending",
    },
  ]

  return (
    <>
      <div className="mb-6 flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <img className="mr-1 size-12" src={ParcusLogo}></img>
          <h2 className="text-3xl font-semibold">Parcus</h2>
        </div>
        <div className="flex cursor-pointer items-center justify-center p-2" onClick={() => setHideSidebar(!hideSidebar)}>
          <IconX className="size-8 lg:hidden" />
        </div>
      </div>

      <p className="mb-2 font-medium text-gray-500">DASHBOARD</p>
      <CategoryTile
        icon={<IconHome className="size-6 stroke-gray-600 stroke-2" />}
        isActive={location == "overview"}
        name="Ringkasan"
        onClick={() => handleNavigation("/overview")}
      />

      <p className="mb-2 mt-4 font-medium text-gray-500">TRANSACTION</p>

      <CategoryTile
        icon={<IconCoins className="size-6 stroke-gray-600 stroke-2" />}
        isActive={location == "assets"}
        name="Asset"
        onClick={() => handleNavigation("/assets")}
      />

      <CategoryTile
        icon={<IconReceipt className="size-6 stroke-gray-600 stroke-2" />}
        isActive={location == "transactions"}
        name="Transaksi"
        onClick={() => handleNavigation("/transactions")}
      />

      <CategoryTile
        icon={<IconCategory className="size-6 stroke-gray-600 stroke-2" />}
        isActive={location == "categories"}
        name="Kategori"
        onClick={() => handleNavigation("/categories")}
      />

      <CategoryTile
        icon={<IconCards className="size-6 stroke-gray-600 stroke-2" />}
        isActive={location == "budgets"}
        name="Anggaran"
        onClick={() => handleNavigation("/budgets")}
      />

      <CategoryTile
        icon={<IconRepeat className="size-6 stroke-gray-600 stroke-2" />}
        isActive={location == "recurrings"}
        name="Transaksi Berulang"
        onClick={() => handleNavigation("/recurrings")}
      />

      <CategoryTile
        icon={<IconListCheck className="size-6 stroke-gray-600 stroke-2" />}
        isActive={location == "reminders"}
        name="Reminder"
        onClick={() => handleNavigation("/reminders")}
      />

      <p className="mb-2 mt-4 font-medium text-gray-500">INSIGHTS</p>

      {menus.map(e => (
        <CategoryTile
          icon={e.icon}
          isActive={location == e.location}
          key={e.location}
          name={Utils.urlToTitle(e.location)}
          onClick={() => handleNavigation(`/${e.location}`)}
        />
      ))}

      <div className="h-full min-h-12"></div>

      <div className="h-4">&nbsp;</div>

      <hr></hr>

      <Popover placement="top-start" showArrow>
        <PopoverTrigger>
          <div className="mb-0 mt-4 flex cursor-pointer flex-row items-center" onClick={() => setPopoverOpen(!popoverOpen)}>
            <Avatar className="mr-2" size="md" src={authInfo.profilePicture} />
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900">{authInfo.name ?? "-"}</p>
              <p className="text-sm font-medium text-gray-400">{authInfo.email ?? "-"}</p>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="min-w-64 px-1 py-2">
            <Button
              className="mb-2 w-full"
              color="default"
              onClick={() => {
                setPopoverOpen(false)
                onOpen()
              }}
            >
              Ubah Foto Profil
            </Button>
            <Button className="w-full" color="danger" onClick={onLogout}>Logout</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <form onSubmit={handleSubmit(data => onSubmitProfilePicture(onClose, data))}>
                <ModalHeader className="flex flex-col gap-1">Update Foto Profil</ModalHeader>
                <ModalBody>
                  <Input type="file" {...register("profile_picture")} />
                </ModalBody>
                <ModalFooter>
                  <Button color="default" onPress={onClose} variant="light">
                    Batal
                  </Button>
                  <Button color="primary" type="submit">
                    Simpan
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default SidebarContent

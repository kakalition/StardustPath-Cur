import { useEffect, useState } from "react"
import { IconMenu2 } from "@tabler/icons-react"
import { Avatar, useDisclosure } from "@nextui-org/react"
import { Outlet, useLoaderData, useLocation } from "react-router-dom"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import Utils from "../../../utils"
import SidebarContent from "./components/sidebar_content"
import SettingsModal from "./components/settings_modal"
import APIUtils from "../../../common/api_utils"

import "react-contexify/dist/ReactContexify.css"

function ParcusMain() {
  const [authInfo, setAuthInfo] = useState(useLoaderData())
  const onSubmitProfilePicture = async (onClose, data) => {
    data.profile_picture = data.profile_picture[0]
    const promise = axios.post(`${import.meta.env.VITE_BASE_API_URL}/auth/profile-picture`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })

    toast.promise(promise, {
      loading: "Memperbarui foto profil..",
      success: () => "Berhasil memperbarui foto profil!",
      error: (err) => {
        return Utils.capitalizeFirstWord(err.response?.data?.message ?? "Unknown error.")
      },
    })

    try {
      await promise
      const tempAuthInfo = (await APIUtils.getIdentity()).data
      tempAuthInfo.profile_url += `?${new Date().getTime()}`
      setAuthInfo(tempAuthInfo)
      onClose()
    }
    catch (err) {
      console.error("[ON UPLOAD PROFILE PICTURE]", err)
    }
  }

  const title = Utils.urlToTitle(useLocation().pathname.replaceAll("/", ""))

  const [hideSidebar, setHideSidebar] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const onWindowResize = () => {
    setHideSidebar(window.innerWidth < 1280)
  }

  useEffect(() => {
    onWindowResize()
    window.addEventListener("resize", onWindowResize)
  }, [])

  const logout = async () => {
    try {
      const promise = axios.post(`${import.meta.env.VITE_BASE_API_URL}/auth/logout`, {}, {
        withCredentials: true,
      })

      toast.promise(promise, {
        success: () => "Berhasil keluar!",
        error: (err) => {
          return Utils.capitalizeFirstWord(err.response?.data?.message ?? "Unknown error.")
        },
      })

      window.location = `${import.meta.env.VITE_AUTH_URL}/login`
    }
    catch (error) {
      console.error("[ON LOGOUT]", error)
    }
  }

  return (
    <>
      <div className="flex h-screen w-screen flex-row overflow-x-hidden">
        <div className={`${hideSidebar ? "hidden" : "flex w-full flex-none flex-col xl:w-96"} overflow-y-scroll border-r-1 border-r-gray-200 bg-gray-100 p-6 transition`}>
          <SidebarContent authInfo={authInfo} hideSidebar={hideSidebar} onLogout={logout} onOpenSettings={onOpen} onSubmitProfilePicture={onSubmitProfilePicture} setHideSidebar={setHideSidebar} />
        </div>
        <div className={`${hideSidebar ? "flex" : "hidden lg:flex"} w-full flex-col overflow-hidden`}>
          <div className="flex h-16 flex-none flex-row items-center justify-between border-b-2 border-r-gray-200 px-4 py-2 lg:p-4">
            <div className="flex flex-row items-center">
              <IconMenu2 className="mr-1 size-8 cursor-pointer stroke-2 p-2 lg:size-10" onClick={() => setHideSidebar(!hideSidebar)} />
              <p className="font-medium lg:text-xl">{title}</p>
            </div>
            <Avatar size="md" src={authInfo?.profilePicture ?? ""} />
          </div>
          <div className="flex size-full overflow-scroll">
            <Outlet />
          </div>
        </div>
      </div>
      <SettingsModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <Toaster />
    </>
  )
}

export default ParcusMain

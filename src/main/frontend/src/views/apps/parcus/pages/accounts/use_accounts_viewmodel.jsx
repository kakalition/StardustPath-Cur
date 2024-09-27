import { Pagination } from "@nextui-org/react"
import axios from "axios"
import toast from "react-hot-toast"
import useSWR from "swr"
import Utils from "../../../../../utils"
import { useMemo, useState } from "react"

function useAccountsViewModel() {
  const [heldId, setHeldId] = useState(null)

  const [queryParams, _setQueryParams] = useState({
    page: 0,
    size: 20,
    query: "",
  })

  const setQueryParams = (key, value) => {
    const temp = { ...queryParams }
    temp[key] = value
    temp["page"] = temp["page"] - 1

    _setQueryParams(temp)
  }

  const updateQueryParams = (values) => {
    const temp = { ...queryParams, ...values }
    _setQueryParams(temp)
  }

  const onSubmit = async (onCloseModal, data) => {
    const isSuccess = await postAccount(data)
    if (isSuccess != true) {
      return
    }

    onCloseModal()
    mutate()
  }

  const onDelete = async (onCloseModal) => {
    const isSuccess = await deleteAccount(heldId)
    if (isSuccess != true) {
      return
    }

    onCloseModal()
    mutate()
  }

  const { mutate, data, isLoading } = useSWR([`${import.meta.env.VITE_BASE_API_URL}/accounts`, queryParams], Utils.fetcher, {
    keepPreviousData: true,
  })

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data?.count / queryParams.size) : 0
  }, [data?.count, queryParams.size])

  const loadingState = isLoading || data?.results?.length === 0 ? "loading" : "idle"

  const paginationElement = (
    <div className="flex w-full justify-center">
      <Pagination
        color="primary"
        isCompact
        onChange={page => setQueryParams("page", page)}
        showShadow
        total={pages}
      />
    </div>
  )

  const postAccount = async (payload) => {
    const promise = axios({
      url: `${import.meta.env.VITE_BASE_API_URL}/accounts/${payload.id ?? ""}`,
      method: payload.id ? "PUT" : "POST",
      data: payload,
      withCredentials: true,
    })

    toast.promise(
      promise,
      {
        loading: "Menyimpan dompet..",
        success: "Berhasil menyimpan dompet.",
        error: "Gagal menyimpan dompet.",
      },
    )

    try {
      const response = await promise
      console.log("[POST Account]", response)

      return true
    }
    catch (error) {
      console.error("[POST Account]", error)

      return false
    }
  }

  const deleteAccount = async (id) => {
    const promise = axios.delete(`${import.meta.env.VITE_BASE_API_URL}/accounts/${id}`, {
      withCredentials: true,
    })

    toast.promise(
      promise,
      {
        loading: "Menghapus dompet..",
        success: "Berhasil menghapus dompet.",
        error: "Gagal menghapus dompet.",
      },
    )

    try {
      const response = await promise
      console.log("[DELETE Account]", response)

      return true
    }
    catch (error) {
      console.error("[DELETE Account]", error)

      return false
    }
  }

  return {
    data,
    loadingState,
    paginationElement,
    pages,
    setHeldId,
    onDelete,
    onSubmit,
    queryParams,
    setQueryParams,
    onSearch: updateQueryParams,
  }
}

export default useAccountsViewModel

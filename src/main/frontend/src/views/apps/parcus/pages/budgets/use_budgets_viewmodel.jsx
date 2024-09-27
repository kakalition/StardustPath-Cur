import { Pagination } from "@nextui-org/react"
import axios from "axios"
import toast from "react-hot-toast"
import useSWR from "swr"
import Utils from "../../../../../utils"
import { useMemo, useState } from "react"
import moment from "moment"

function useBudgetsViewModel() {
  const [heldId, setHeldId] = useState(null)

  const [queryParams, _setQueryParams] = useState({
    page: 0,
    size: 20,
    query: "",
    year: moment().format("YYYY"),
    month: moment().format("M"),
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
    data.date = data.date.toString().replace(/[[].+[\]]/, "")
    data.amount = parseFloat(data.amount)
    data.year = parseInt(data.year)
    data.month = parseInt(data.month)

    const isSuccess = await postCategory(data)
    if (isSuccess != true) {
      return
    }

    onCloseModal()
    mutate()
  }

  const onDelete = async (onCloseModal) => {
    const isSuccess = await deleteCategory(heldId)
    if (isSuccess != true) {
      return
    }

    onCloseModal()
    mutate()
  }

  const { mutate, data, isLoading } = useSWR([`${import.meta.env.VITE_BASE_API_URL}/api/budgets`, queryParams], Utils.fetcher, {
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

  const postCategory = async (payload) => {
    const promise = axios({
      url: `${import.meta.env.VITE_BASE_API_URL}/api/budgets/${payload.id ?? ""}`,
      method: payload.id ? "PUT" : "POST",
      data: payload,
      withCredentials: true,
    })

    toast.promise(
      promise,
      {
        loading: "Menyimpan anggaran..",
        success: "Berhasil menyimpan anggaran.",
        error: "Gagal menyimpan anggaran.",
      },
    )

    try {
      const response = await promise
      console.log("[POST CATEGORY]", response)

      return true
    }
    catch (error) {
      console.error("[POST CATEGORY]", error)

      return false
    }
  }

  const deleteCategory = async (id) => {
    const promise = axios.delete(`${import.meta.env.VITE_BASE_API_URL}/api/budgets/${id}`, {
      withCredentials: true,
    })

    toast.promise(
      promise,
      {
        loading: "Menghapus anggaran..",
        success: "Berhasil menghapus anggaran.",
        error: "Gagal menghapus anggaran.",
      },
    )

    try {
      const response = await promise
      console.log("[DELETE CATEGORY]", response)

      return true
    }
    catch (error) {
      console.error("[DELETE CATEGORY]", error)

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

export default useBudgetsViewModel

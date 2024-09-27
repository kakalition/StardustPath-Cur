import { Pagination } from "@nextui-org/react"
import axios from "axios"
import toast from "react-hot-toast"
import useSWR from "swr"
import Utils from "../../../../../utils"
import { useMemo, useState } from "react"
import moment from "moment"

function useRecurringTransactionsViewModel() {
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
    data.startAt = data.startAt.toDate()
    data.nextDueAt = data.nextDueAt.toDate()

    data.amount = parseFloat(data.amount)

    const isSuccess = await postRecurringTransaction(data)
    if (isSuccess != true) {
      return
    }

    onCloseModal()
    mutate()
  }

  const onDelete = async (onCloseModal) => {
    const isSuccess = await deleteRecurringTransaction(heldId)
    if (isSuccess != true) {
      return
    }

    onCloseModal()
    mutate()
  }

  const { mutate, data, isLoading } = useSWR([`${import.meta.env.VITE_BASE_API_URL}/api/recurrings`, queryParams], Utils.fetcher, {
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

  const postRecurringTransaction = async (payload) => {
    const promise = axios({
      url: `${import.meta.env.VITE_BASE_API_URL}/api/recurrings/${payload.id ?? ""}`,
      method: payload.id ? "PUT" : "POST",
      data: payload,
      withCredentials: true,
    })

    toast.promise(
      promise,
      {
        loading: "Menyimpan transaksi berulang..",
        success: "Berhasil menyimpan transaksi berulang.",
        error: "Gagal menyimpan transaksi berulang.",
      },
    )

    try {
      const response = await promise
      console.log("[POST RECURRINGTRANSACTION]", response)

      return true
    }
    catch (error) {
      console.error("[POST RECURRINGTRANSACTION]", error)

      return false
    }
  }

  const deleteRecurringTransaction = async (id) => {
    const promise = axios.delete(`${import.meta.env.VITE_BASE_API_URL}/api/recurrings/${id}`, {
      withCredentials: true,
    })

    toast.promise(
      promise,
      {
        loading: "Menghapus transaksi berulang..",
        success: "Berhasil menghapus transaksi berulang.",
        error: "Gagal menghapus transaksi berulang.",
      },
    )

    try {
      const response = await promise
      console.log("[DELETE RECURRINGTRANSACTION]", response)

      return true
    }
    catch (error) {
      console.error("[DELETE RECURRINGTRANSACTION]", error)

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

export default useRecurringTransactionsViewModel

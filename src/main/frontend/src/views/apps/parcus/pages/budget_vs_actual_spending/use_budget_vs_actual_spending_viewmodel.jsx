import { Pagination } from "@nextui-org/react"
import axios from "axios"
import toast from "react-hot-toast"
import useSWR from "swr"
import Utils from "../../../../../utils"
import { useMemo, useState } from "react"
import moment from "moment"

function useBudgetVsActualSpendingViewModel() {
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

  const { data, isLoading } = useSWR([`${import.meta.env.VITE_BASE_API_URL}/api/budgets`, queryParams], Utils.fetcher, {
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

  return {
    data,
    loadingState,
    paginationElement,
    pages,
    queryParams,
    setQueryParams,
    onSearch: updateQueryParams,
  }
}

export default useBudgetVsActualSpendingViewModel

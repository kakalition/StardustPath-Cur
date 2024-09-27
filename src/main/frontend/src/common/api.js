import axios from "axios"

const ASSET_ITEMS_BASE_URL = `${import.meta.env.VITE_BASE_API_URL}/api/assets/items`
const ASSET_ITEMS_AUTO_URL = `${import.meta.env.VITE_BASE_API_URL}/api/auto/asset-items`
const ASSET_TRANSACTIONS_BASE_URL = `${import.meta.env.VITE_BASE_API_URL}/api/assets/transactions`
const REMINDERS_BASE_URL = `${import.meta.env.VITE_BASE_API_URL}/api/reminders`

const AssetItems = {
  getUrl: ASSET_ITEMS_BASE_URL,
  getAutoUrl: ASSET_ITEMS_AUTO_URL,
  post: async (data) => {
    return await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/assets/items`, data, {
      withCredentials: true,
    })
  },
  put: async (id, data) => {
    return await axios.put(`${import.meta.env.VITE_BASE_API_URL}/api/assets/items/${id}`, data, {
      withCredentials: true,
    })
  },
  delete: async (id) => {
    return await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/api/assets/items/${id}`, {
      withCredentials: true,
    })
  },
}

const AssetTransactions = {
  getUrl: ASSET_TRANSACTIONS_BASE_URL,
  post: async data => await axios.post(`${ASSET_TRANSACTIONS_BASE_URL}`, data, {
    withCredentials: true,
  }),
  put: async (id, data) => await axios.put(`${ASSET_TRANSACTIONS_BASE_URL}/${id}`, data, {
    withCredentials: true,
  }),
  delete: async id => await axios.delete(`${ASSET_TRANSACTIONS_BASE_URL}/${id}`, {
    withCredentials: true,
  }),
}

const Reminders = {
  getUrl: REMINDERS_BASE_URL,
  post: async data => await axios.post(`${REMINDERS_BASE_URL}`, data, {
    withCredentials: true,
  }),
  put: async (id, data) => await axios.put(`${REMINDERS_BASE_URL}/${id}`, data, {
    withCredentials: true,
  }),
  delete: async id => await axios.delete(`${REMINDERS_BASE_URL}/${id}`, {
    withCredentials: true,
  }),
}

const API = {
  ASSET_ITEMS_BASE_URL,
  ASSET_ITEMS_AUTO_URL,
  ASSET_TRANSACTIONS_BASE_URL,
  AssetItems,
  AssetTransactions,
  Reminders,
}

export default API

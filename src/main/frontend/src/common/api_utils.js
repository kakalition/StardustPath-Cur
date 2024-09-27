import axios from "axios"

class APIUtils {
  static async getIdentity() {
    return await axios.get(`${import.meta.env.VITE_BASE_API_URL}/auth/identity`, {
      withCredentials: true,
    })
  }
}

export default APIUtils

import axios from "axios"

class Utils {
  static compactFormatter = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 0,
  })

  static formatToCompact(value) {
    return this.compactFormatter.format(value)
  }

  static capitalizeFirstWord(value) {
    return value[0].toUpperCase() + value.slice(1).toLowerCase()
  }

  static toTitleCase(value) {
    return value.split(" ").map((word) => {
      return word[0].toUpperCase() + word.substring(1)
    }).join(" ")
  }

  static fetcher([url, params]) {
    const queryParams = (new URLSearchParams(params)).toString()
    return axios.get(`${url}?${queryParams}`, { withCredentials: true }).then(res => res.data)
  }

  static getFrequencyValue(value) {
    if (value == "WEEKLY") {
      return "Mingguan"
    }

    if (value == "MONTHLY") {
      return "Bulanan"
    }

    if (value == "YEARLY") {
      return "Tahunan"
    }
  }

  static getLocaleDate(date) {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  static getIndonesianCurrency(value) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value)
  }

  static getIndonesianCurrencyCompact(value) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0, notation: "compact" }).format(value)
  }

  static coalesce(lowerBound, upperBound, value) {
    if (value < lowerBound) {
      return lowerBound
    }

    if (value > upperBound) {
      return upperBound
    }

    return value
  }

  static urlToTitle(value) {
    if (value == "overview") {
      return "Ringkasan"
    }

    if (value == "transactions") {
      return "Transaksi"
    }

    if (value == "categories") {
      return "Kategori"
    }

    if (value == "budgets") {
      return "Anggaran"
    }

    if (value == "recurrings") {
      return "Transaksi Berulang"
    }

    if (value == "assets") {
      return "Asset"
    }

    if (value == "net-worth-trends") {
      return "Tren Jumlah Kekayaan"
    }

    if (value == "income-and-expense-trends") {
      return "Tren Pemasukan dan Pengeluaran"
    }

    if (value == "expenses-by-day-of-the-week-and-time-of-the-day") {
      return "Pengeluaran Berdasarkan Hari dan Jam"
    }

    if (value == "budget-vs-actual-spending") {
      return "Anggaran vs Pengeluaran"
    }

    if (value == "spending-by-category") {
      return "Pengeluaran Berdasarkan Kategori"
    }

    if (value == "expense-ratio") {
      return "Rasio Pengeluaran"
    }

    if (value == "savings-rate-trend") {
      return "Tren Tingkat Tabungan"
    }

    if (value == "income-vs-expense-over-time") {
      return "Perbandingan Pemasukan dan Pengeluaran"
    }

    if (value == "recurring-vs-one-time-expenses") {
      return "Pengeluaran Rutin vs Sekali"
    }

    if (value == "weekday-vs-weekend-spending") {
      return "Perbandingan Pengeluaran Weekday vs Weekend"
    }

    if (value == "daily-spending-heat-map") {
      return "Pengeluaran Berdasarkan Hari"
    }

    if (value == "hourly-spending-heat-map") {
      return "Pengeluaran Berdasarkan Jam"
    }

    if (value == "reminders") {
      return "Reminder"
    }
  }

  static numberToIndonesianDate(value) {
    switch (value) {
      case 1:
        return "Senin"
      case 2:
        return "Selasa"
      case 3:
        return "Rabu"
      case 4:
        return "Kamis"
      case 5:
        return "Jumat"
      case 6:
        return "Sabtu"
      case 7:
        return "Minggu"
    default:
      return "-"
    }
  }

  static getRange = (start, stop, step) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)
}

export default Utils

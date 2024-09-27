class TypeCollection {
  static assetTypes = [
    {
      key: "CASH_AND_CASH_EQUIVALENT",
      value: "Cash and Cash Equivalent",
    },
    {
      key: "STOCKS",
      value: "Stocks",
    },
    {
      key: "BONDS",
      value: "Bonds",
    },
    {
      key: "MUTUAL_FUNDS",
      value: "Mutual Funds",
    },
    {
      key: "ETFS",
      value: "ETFs",
    },
    {
      key: "REAL_ESTATE",
      value: "Real Estate",
    },
    {
      key: "CRYPTOCURRENCIES",
      value: "Cryptocurrencies",
    },
    {
      key: "PRECIOUS_METAL",
      value: "Precious Metal",
    },
    {
      key: "COLLECTIBLES",
      value: "Collectibles",
    },
    {
      key: "OTHER",
      value: "Other",
    },
  ]

  static recurrences = [
    {
      key: "WEEKLY",
      value: "Mingguan",
    },
    {
      key: "BI_WEEKLY",
      value: "Dua Mingguan",
    },
    {
      key: "MONTHLY",
      value: "Bulanan",
    },
    {
      key: "QUARTERLY",
      value: "Per 3 Bulan",
    },
    {
      key: "HALF_YEARLY",
      value: "Per 6 Bulan",
    },
    {
      key: "YEARLY",
      value: "Per Tahun",
    },
  ]

  static prioritization = [
    {
      key: "LOW",
      value: "Rendah",
    },
    {
      key: "MEDIUM",
      value: "Sedang",
    },
    {
      key: "HIGH",
      value: "Tinggi",
    },
  ]

  static getAssetTypeNameByKey = key => this.assetTypes.filter(e => e.key == key)[0]?.value ?? "-"
}

export default TypeCollection

import { IconBriefcase, IconBuilding, IconCash, IconChartLine, IconChartPie, IconCoinBitcoin, IconExchange, IconGift, IconMeat, IconMeteor, IconQuestionMark } from "@tabler/icons-react"

class TypeCollectionJSX {
  static getAssetTypeIcon = (type, size = 48, className = "") => {
    switch (type) {
      case "CASH_AND_CASH_EQUIVALENT":
        return <IconCash className={className} size={size} />
      case "STOCKS":
        return <IconChartLine className={className} size={size} />
      case "BONDS":
        return <IconBriefcase className={className} size={size} />
      case "MUTUAL_FUNDS":
        return <IconChartPie className={className} size={size} />
      case "ETFS":
        return <IconExchange className={className} size={size} />
      case "REAL_ESTATE":
        return <IconBuilding className={className} size={size} />
      case "CRYPTOCURRENCIES":
        return <IconCoinBitcoin className={className} size={size} />
      case "PRECIOUS_METAL":
        return <IconMeteor className={className} size={size} />
      case "COLLECTIBLES":
        return <IconGift className={className} size={size} />
      case "OTHER":
        return <IconQuestionMark className={className} size={size} />
      default:
        return "-"
    }
  }
}

export default TypeCollectionJSX

import { Tab, Tabs } from "@nextui-org/react"
import CurrentAssetsPage from "./current_assets_page"
import AssetItemsPage from "./asset_items_page"
import AssetTransactionsPage from "./asset_transactions_page"

function AssetPage() {
  return (
    <div className="flex size-full flex-col p-4">
      <Tabs aria-label="Options">
        <Tab key="current_assets" title="Asset Saat Ini">
          <CurrentAssetsPage />
        </Tab>
        <Tab key="transaction_history" title="Riwayat Transaksi">
          <AssetTransactionsPage />
        </Tab>
        <Tab key="items" title="Daftar Asset">
          <AssetItemsPage />
        </Tab>
      </Tabs>
    </div>
  )
}

export default AssetPage

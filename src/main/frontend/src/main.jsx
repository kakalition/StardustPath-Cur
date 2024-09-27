import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { NextUIProvider } from "@nextui-org/react"
import TransactionOverTime from "./views/apps/parcus/pages/transaction_over_time.jsx"
import CategoryDistribution from "./views/apps/parcus/pages/category_distribution.jsx"
import TransactionDaySeasonality from "./views/apps/parcus/pages/transaction_day_seasonality.jsx"
import ParcusMain from "./views/apps/parcus/parcus_main.jsx"
import Categories from "./views/apps/parcus/pages/categories/categories.jsx"
import Accounts from "./views/apps/parcus/pages/accounts/accounts.jsx"
import RecurringTransactions from "./views/apps/parcus/pages/recurring_transactions/recurring_transactions.jsx"
import Transactions from "./views/apps/parcus/pages/transactions/transactions.jsx"
import Budgets from "./views/apps/parcus/pages/budgets/budgets.jsx"
import Dashboard from "./views/apps/parcus/pages/dashboard.jsx"
import IncomeAndExpenseTrends from "./views/apps/parcus/pages/income_and_expense_trends.jsx"
import ExpensesByDayOfTheWeekAndTimeOfTheDay from "./views/apps/parcus/pages/expenses_by_day_of_the_week_and_time_of_the_day.jsx"
import APIUtils from "./common/api_utils.js"
import BudgetVsActualSpending from "./views/apps/parcus/pages/budget_vs_actual_spending/budget_vs_actual_spending.jsx"
import TransactionSeasonalityByHour from "./views/apps/parcus/pages/transaction_seasonality_by_hour.jsx"
import LandingPage from "./landing_page.jsx"
import LoginPage from "./views/apps/parcus/pages/login_page.jsx"
import RegisterPage from "./views/apps/parcus/pages/register_page.jsx"
import NetWorthTrends from "./views/apps/parcus/pages/net_worth_trends.jsx"
import SpendingByCategory from "./views/apps/parcus/pages/spending_by_category.jsx"
import ExpenseRatioTrend from "./views/apps/parcus/pages/expense_ratio_trend.jsx"
import IncomeVsExpenseOverTime from "./views/apps/parcus/pages/income_vs_expense_over_time.jsx"
import WeekdayVsWeekendSpending from "./views/apps/parcus/pages/weekday_vs_weekend_spending.jsx"
import DailySpendingHeatMap from "./views/apps/parcus/pages/daily_spending_heat_map.jsx"
import HourlySpendingHeatMap from "./views/apps/parcus/pages/hourly_spending_heat_map.jsx"
import RecurringVsOneTimeExpenses from "./views/apps/parcus/pages/recurring_vs_one_time_expenses.jsx"
import SavingsRateTrend from "./views/apps/parcus/pages/savings_rate_trend.jsx"
import AssetPage from "./views/apps/parcus/pages/assets/assets_page.jsx"
import Reminders from "./views/apps/parcus/pages/reminders/reminders.jsx"

const router = createBrowserRouter([
  {
    path: "",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: async () => {
      try {
        const response = await APIUtils.getIdentity()
        const data = response.data

        if (data) {
          window.location = `${import.meta.env.VITE_AUTH_URL}/overview`
        }

        return null
      }
      catch (error) {
        console.log("err", error)
      }

      return null
    },
  },
  {
    path: "/register",
    element: <RegisterPage />,
    loader: async () => {
      try {
        const response = await APIUtils.getIdentity()
        const data = response.data

        if (data) {
          window.location = `${import.meta.env.VITE_AUTH_URL}/overview`
        }

        return null
      }
      catch (error) {
        console.log("err", error)
      }

      return null
    },
  },
  {
    path: "",
    element: <ParcusMain />,
    loader: async () => {
      try {
        const response = await APIUtils.getIdentity()
        const data = response.data
        data.profile_url += `?${new Date().getTime()}`

        return data
      }
      catch (error) {
        window.location = `${import.meta.env.VITE_AUTH_URL}/login`
      }
    },
    children: [
      {
        path: "/overview",
        element: <Dashboard />,
      },
      {
        path: "/assets",
        element: <AssetPage />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/accounts",
        element: <Accounts />,
      },
      {
        path: "/budgets",
        element: <Budgets />,
      },
      {
        path: "/recurrings",
        element: <RecurringTransactions />,
      },
      {
        path: "/reminders",
        element: <Reminders />,
      },
      {
        path: "/transaction-over-time",
        element: <TransactionOverTime />,
      },
      {
        path: "/category-distribution",
        element: <CategoryDistribution />,
      },
      {
        path: "/transaction-seasonality-by-hour",
        element: <TransactionSeasonalityByHour />,
      },
      {
        path: "/transaction-day-seasonality",
        element: <TransactionDaySeasonality />,
      },
      {
        path: "/income-and-expense-trends",
        element: <IncomeAndExpenseTrends />,
      },
      {
        path: "/net-worth-trends",
        element: <NetWorthTrends />,
      },
      {
        path: "/budget-vs-actual-spending",
        element: <BudgetVsActualSpending />,
      },
      {
        path: "/spending-by-category",
        element: <SpendingByCategory />,
      },
      {
        path: "/expense-ratio",
        element: <ExpenseRatioTrend />,
      },
      {
        path: "/income-vs-expense-over-time",
        element: <IncomeVsExpenseOverTime />,
      },
      {
        path: "/weekday-vs-weekend-spending",
        element: <WeekdayVsWeekendSpending />,
      },
      {
        path: "/expenses-by-day-of-the-week-and-time-of-the-day",
        element: <ExpensesByDayOfTheWeekAndTimeOfTheDay />,
      },
      {
        path: "/daily-spending-heat-map",
        element: <DailySpendingHeatMap />,
      },
      {
        path: "/hourly-spending-heat-map",
        element: <HourlySpendingHeatMap />,
      },
      {
        path: "/recurring-vs-one-time-expenses",
        element: <RecurringVsOneTimeExpenses />,
      },
      {
        path: "/savings-rate-trend",
        element: <SavingsRateTrend />,
      },
    ],
  },
], {
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  </React.StrictMode>,
)

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { SellerUser } from "@/lib/order-api"

interface SellerStatsState {
  customers: SellerUser[]
  totalCustomers: number
  totalRevenue: number
  setCustomers: (customers: SellerUser[]) => void
  calculateStats: () => void
}

export const useSellerStatsStore = create<SellerStatsState>()(
  persist(
    (set, get) => ({
      customers: [],
      totalCustomers: 0,
      totalRevenue: 0,
      setCustomers: (customers: SellerUser[]) => {
        set({ customers })
        // Calculate stats when customers are set
        const uniqueCustomers = new Set(
          customers.map(
            (c) => `${c.first_name}_${c.last_name}_${c.profile_image || ""}`
          )
        ).size
        const revenue = customers.reduce(
          (sum, customer) => sum + (customer.product_price || 0),
          0
        )
        set({
          totalCustomers: uniqueCustomers,
          totalRevenue: revenue,
        })
      },
      calculateStats: () => {
        const { customers } = get()
        const uniqueCustomers = new Set(
          customers.map(
            (c) => `${c.first_name}_${c.last_name}_${c.profile_image || ""}`
          )
        ).size
        const revenue = customers.reduce(
          (sum, customer) => sum + (customer.product_price || 0),
          0
        )
        set({
          totalCustomers: uniqueCustomers,
          totalRevenue: revenue,
        })
      },
    }),
    {
      name: "ecomm-seller-stats-storage",
    }
  )
)


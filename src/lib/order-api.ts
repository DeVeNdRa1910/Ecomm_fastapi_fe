import { api } from "./api"

export type OrderedFrom = "cart" | "product_page"

export interface CreateOrderRequest {
  product_id: string[]
  seller_id: string[]
  ordered_from: OrderedFrom
  user_id: string
  address: string
  category: string
  quantity: number
  unit_price: number
}

export interface CreateOrderResponseObject {
  message?: string
  [key: string]: unknown
}

export type CreateOrderResponse = string | CreateOrderResponseObject

export interface OrderProduct {
  _id: string // Product ID is always present in API response
  title: string
  price: number
  product_image_urls: string[]
  id?: string // Alternative ID format (if any)
  product_id?: string // Alternative field name (if any)
}

export interface Order {
  order_id: string
  user_name: string
  address: string
  quantity: number
  unit_price: number
  payment_status: string
  created_at: string
  is_delivered?: boolean
  products: OrderProduct[]
  product_id?: string[] // Product IDs array from order creation
}

export type GetOrdersResponse = Order[]

export interface SellerUser {
  first_name: string
  last_name: string
  profile_image?: string
  product_name: string
  product_price: number
  product_images: string[]
  last_ordered_time: string
}

export type GetSellerUsersResponse = SellerUser[]

export interface MonthlyGrowthResponse {
  current_month: string
  previous_month: string
  current_month_sales: number
  previous_month_sales: number
  growth_percentage: number
}

export const orderApi = {
  // API: POST /order/create-order
  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponseObject> => {
    const res = await api.post<CreateOrderResponse>("/order/create-order", data)
    if (typeof res === "string") return { message: res }
    return res
  },
  // API: GET /order/get-orders
  getOrders: async (): Promise<GetOrdersResponse> => {
    return api.get<GetOrdersResponse>("/order/get-orders")
  },
  // API: GET /order/get-user (for sellers to get users who bought their products)
  getSellerUsers: async (): Promise<GetSellerUsersResponse> => {
    return api.get<GetSellerUsersResponse>("/order/get-user")
  },
  // API: GET /order/seller/users/export (export users data as CSV)
  exportSellerUsers: async (): Promise<Blob> => {
    return api.downloadFile("/order/seller/users/export")
  },
  // API: GET /order/seller/growth (get monthly growth data)
  getMonthlyGrowth: async (): Promise<MonthlyGrowthResponse> => {
    return api.get<MonthlyGrowthResponse>("/order/seller/growth")
  },
}



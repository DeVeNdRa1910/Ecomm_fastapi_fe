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
}



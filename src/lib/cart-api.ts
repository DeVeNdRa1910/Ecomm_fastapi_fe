import { api } from './api';

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
}

export interface AddToCartResponse {
  message: string;
  cart_item?: {
    product_id: string;
    quantity: number;
  };
}

export interface GetCartResponse {
  cart_items: Array<{
    product_id: string;
    product: {
      id: string;
      title: string;
      price: number;
      product_image_urls: string[];
    };
    quantity: number;
  }>;
  total: number;
}

export interface UpdateCartItemRequest {
  product_id: string;
  quantity: number;
}

export interface RemoveCartItemResponse {
  message?: string;
  // API returns a string directly, but we'll handle both string and object responses
}

export interface CartProduct {
  _id: string; // Cart item ID
  user_id: string; // User ID who owns this cart item
  quantity: number; // Quantity in cart
  product: {
    _id: string; // Product ID
    title: string;
    description: string;
    price: number;
    seller_id: string;
    product_image_urls: string[]; // Array of image URLs
    is_active: boolean;
    category?: string;
  };
}

export interface GetCartProductsResponse {
  cart_products?: CartProduct[];
  // API might return a direct array
}

export const cartApi = {
  // Add product to cart (requires authentication)
  // API expects query parameters: product_id and quantity
  addToCart: async (productId: string, quantity: number = 1): Promise<AddToCartResponse> => {
    const params = new URLSearchParams({
      product_id: productId,
      quantity: quantity.toString(),
    });
    // Send empty body, parameters are in query string
    return api.post<AddToCartResponse>(`/cart/add-product?${params.toString()}`, {});
  },
  // Get cart items (requires authentication)
  getCart: async (): Promise<GetCartResponse> => {
    return api.get<GetCartResponse>('/cart/');
  },
  // Get cart products (requires authentication)
  // API: GET /cart/cart-products (no parameters)
  // Returns: Array of CartProduct objects
  getCartProducts: async (): Promise<CartProduct[]> => {
    const response = await api.get<CartProduct[]>('/cart/cart-products');
    // API returns a direct array of cart products
    return Array.isArray(response) ? response : [];
  },
  // Update cart item quantity (requires authentication)
  updateCartItem: async (productId: string, quantity: number): Promise<AddToCartResponse> => {
    const params = new URLSearchParams({
      product_id: productId,
      quantity: quantity.toString(),
    });
    return api.put<AddToCartResponse>(`/cart/update-product?${params.toString()}`, {});
  },
  // Remove item from cart (requires authentication)
  // API: DELETE /cart/{product_id} with product_id as query parameter
  // Note: Despite {product_id} in path, API expects it as query parameter
  removeFromCart: async (productId: string): Promise<RemoveCartItemResponse> => {
    const params = new URLSearchParams({
      product_id: productId,
    });
    // API endpoint shows /cart/{product_id} but product_id is passed as query parameter
    // Response is a string (200) or validation error (422)
    const response = await api.delete<string | RemoveCartItemResponse>(`/cart/?${params.toString()}`);
    // Handle both string and object responses
    if (typeof response === 'string') {
      return { message: response };
    }
    return response;
  },
  // Clear entire cart (requires authentication)
  clearCart: async (): Promise<{ message: string }> => {
    return api.delete<{ message: string }>('/cart/clear');
  },
};


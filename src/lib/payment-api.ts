import { api } from './api';

export interface CheckoutProduct {
  name: string;
  price: number;
  quantity: number;
}

export interface CreateCheckoutSessionRequest {
  products: CheckoutProduct[];
}

export interface CreateCheckoutSessionResponse {
  url: string;
}

export const paymentApi = {
  // Create checkout session
  // API: POST /payment/create-checkout-session
  // Request: { "products": [{ "name": "string", "price": number, "quantity": number }] }
  // Response: { "url": "string" }
  createCheckoutSession: async (
    products: CheckoutProduct[]
  ): Promise<CreateCheckoutSessionResponse> => {
    const requestData: CreateCheckoutSessionRequest = {
      products,
    };
    return api.post<CreateCheckoutSessionResponse>(
      '/payment/create-checkout-session',
      requestData
    );
  },
};


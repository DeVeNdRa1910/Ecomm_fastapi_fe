import { api } from './api';

export interface AddProductRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  images: File[];
}

export interface AddProductResponse {
  message: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string | null;
  seller_id: string;
  quantity: number;
  product_image_urls: string[];
  product_image_public_ids: string[];
}

export interface GetProductsResponse {
  seller_products: Product[];
}

export interface GetProductByIdResponse {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    seller_id: string;
    quantity: number;
    product_image_urls: string[];
  };
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  quantity?: number;
  images?: File[];
}

export interface UpdateProductResponse {
  message: string;
}

export interface DeleteProductResponse {
  message: string;
}

export const productApi = {
  addProduct: async (data: AddProductRequest): Promise<AddProductResponse> => {
    const form = new FormData();
    
    // Append text fields
    form.append('title', data.title);
    form.append('description', data.description);
    form.append('price', data.price.toString());
    form.append('category', data.category);
    form.append('quantity', data.quantity.toString());
    
    // Append image files - API expects multiple images with the same key
    data.images.forEach((image) => {
      form.append('images', image);
    });

    return api.postForm<AddProductResponse>('/product/', form);
  },
  updateProduct: async (productId: string, data: UpdateProductRequest): Promise<UpdateProductResponse> => {
    const form = new FormData();
    
    // Append text fields only if they are provided
    if (data.title !== undefined) {
      form.append('title', data.title || '');
    }
    if (data.description !== undefined) {
      form.append('description', data.description || '');
    }
    if (data.price !== undefined) {
      form.append('price', data.price.toString());
    }
    if (data.category !== undefined) {
      form.append('category', data.category || '');
    }
    if (data.quantity !== undefined) {
      form.append('quantity', data.quantity.toString());
    }
    
    // Append image files if provided - API expects multiple images with the same key
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        form.append('images', image);
      });
    }

    return api.putForm<UpdateProductResponse>(`/product/${productId}`, form);
  },
  getProducts: async (): Promise<GetProductsResponse> => {
    return api.get<GetProductsResponse>('/product/');
  },
  getProductById: async (productId: string): Promise<GetProductByIdResponse> => {
    return api.get<GetProductByIdResponse>(`/product/${productId}`);
  },
  deleteProduct: async (productId: string): Promise<DeleteProductResponse> => {
    return api.delete<DeleteProductResponse>(`/product/${productId}`);
  },
};


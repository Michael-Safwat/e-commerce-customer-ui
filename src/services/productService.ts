import { API_CONFIG } from '../config/api';
import { Product as FrontendProduct } from '../types/product';

// Backend Product interface (matches your Spring Boot entity)
export interface BackendProduct {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  category: string;
  image: string;
  rating: number;
}

export interface ProductPage {
  content: BackendProduct[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface ProductFilters {
  category?: string;
  name?: string;
  page?: number;
  size?: number;
}

// Transform backend product to frontend product
const transformBackendToFrontend = (backendProduct: BackendProduct): FrontendProduct => {
  return {
    id: backendProduct.id.toString(), // Convert number to string for frontend
    name: backendProduct.name,
    price: backendProduct.price,
    image: backendProduct.image,
    category: backendProduct.category,
    description: backendProduct.description,
    inStock: backendProduct.stock > 0, // Convert stock to boolean
    rating: backendProduct.rating,
    reviews: Math.floor(Math.random() * 200) + 50, // Generate random reviews for now
    // Optional fields
    colors: ['Black', 'White'], // Default colors
    sizes: ['S', 'M', 'L', 'XL'], // Default sizes
  };
};

class ProductService {
  private baseUrl = `${API_CONFIG.BASE_URL}/products`;

  async getAllProducts(page: number = 0, size: number = 10): Promise<{ content: FrontendProduct[], totalElements: number, totalPages: number }> {
    try {
      const response = await fetch(`${this.baseUrl}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const productPage: ProductPage = await response.json();
      
      return {
        content: productPage.content.map(transformBackendToFrontend),
        totalElements: productPage.totalElements,
        totalPages: productPage.totalPages,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductsWithFilters(filters: ProductFilters): Promise<{ content: FrontendProduct[], totalElements: number, totalPages: number }> {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.name) params.append('name', filters.name);
      if (filters.page !== undefined) params.append('page', filters.page.toString());
      if (filters.size !== undefined) params.append('size', filters.size.toString());

      const response = await fetch(`${this.baseUrl}/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const productPage: ProductPage = await response.json();
      
      return {
        content: productPage.content.map(transformBackendToFrontend),
        totalElements: productPage.totalElements,
        totalPages: productPage.totalPages,
      };
    } catch (error) {
      console.error('Error fetching products with filters:', error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<FrontendProduct> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const backendProduct: BackendProduct = await response.json();
      return transformBackendToFrontend(backendProduct);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  async getProductsByCategory(category: string, page: number = 0, size: number = 10): Promise<{ content: FrontendProduct[], totalElements: number, totalPages: number }> {
    return this.getProductsWithFilters({ category, page, size });
  }

  async searchProductsByName(name: string, page: number = 0, size: number = 10): Promise<{ content: FrontendProduct[], totalElements: number, totalPages: number }> {
    return this.getProductsWithFilters({ name, page, size });
  }
}

export const productService = new ProductService(); 
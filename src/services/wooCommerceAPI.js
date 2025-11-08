import { encode } from 'base-64';

// WooCommerce API Configuration
// Replace these with your actual WooCommerce store credentials
const WOOCOMMERCE_STORE_URL = 'https://aarsunwoods.in/0newsite/'; // Your WooCommerce store URL
const CONSUMER_KEY = 'ck_6ea297ed4a600153000c4108f7f11c3360d0a1d5'; // Your WooCommerce Consumer Key
const CONSUMER_SECRET = 'cs_f29e45ef10f9b35140588c64d62d8417f840f959'; // Your WooCommerce Consumer Secret

class WooCommerceAPI {
  constructor() {
    // Remove trailing slash from store URL if present
    const cleanStoreURL = WOOCOMMERCE_STORE_URL.replace(/\/$/, '');
    this.baseURL = `${cleanStoreURL}/wp-json/wc/v3`;
    this.authToken = null;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  // Helper method to encode credentials for Basic Auth
  getBasicAuth() {
    // Base64 encoding for React Native
    const credentials = `${CONSUMER_KEY}:${CONSUMER_SECRET}`;
    return encode(credentials);
  }

  // Helper method for API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Basic Auth for WooCommerce REST API
    if (!this.authToken) {
      headers['Authorization'] = `Basic ${this.getBasicAuth()}`;
    } else {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      console.log('API Request:', url);
      console.log('Headers:', { ...headers, Authorization: 'Basic ***' });
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText || `HTTP error! status: ${response.status}` };
        }
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || errorData.code || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      console.error('Error details:', {
        message: error.message,
        url: url,
        endpoint: endpoint
      });
      throw error;
    }
  }

  // Authentication endpoints (using WordPress REST API)
  async login(username, password) {
    try {
      // Remove trailing slash from store URL if present
      const cleanStoreURL = WOOCOMMERCE_STORE_URL.replace(/\/$/, '');
      const response = await fetch(`${cleanStoreURL}/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Fetch user details (reuse cleanStoreURL)
      const userResponse = await fetch(`${cleanStoreURL}/wp-json/wp/v2/users/me`, {
        headers: {
          'Authorization': `Bearer ${data.token}`,
        },
      });

      const userData = await userResponse.json();

      return {
        token: data.token,
        user: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          name: userData.name,
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(email, username, password, firstName, lastName) {
    try {
      // First, create the user via WooCommerce Customer API
      const customerData = {
        email,
        username,
        password,
        first_name: firstName,
        last_name: lastName,
      };

      const response = await fetch(`${this.baseURL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.getBasicAuth()}`,
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const customer = await response.json();

      // Then login to get the token
      const loginResult = await this.login(username, password);
      
      return loginResult;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Get all products
  async getProducts(params = {}) {
    // Build query params properly
    const queryParams = new URLSearchParams();
    queryParams.append('per_page', params.per_page || 100);
    queryParams.append('page', params.page || 1);
    
    // Add any additional params (excluding per_page and page to avoid duplicates)
    Object.keys(params).forEach(key => {
      if (key !== 'per_page' && key !== 'page' && params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const products = await this.request(`/products?${queryParams.toString()}`);
    
    // Transform WooCommerce products to match app structure
    return products.map(product => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images && product.images.length > 0 
        ? product.images[0].src 
        : 'https://via.placeholder.com/500',
      description: product.description || product.short_description || '',
      category: product.categories && product.categories.length > 0
        ? product.categories[0].name
        : 'Uncategorized',
      rating: product.average_rating ? parseFloat(product.average_rating) : 0,
      stockStatus: product.stock_status,
      inStock: product.stock_status === 'instock',
      product: product, // Keep full product data for details
    }));
  }

  // Get single product by ID
  async getProduct(id) {
    const product = await this.request(`/products/${id}`);
    
    return {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images && product.images.length > 0 
        ? product.images[0].src 
        : 'https://via.placeholder.com/500',
      images: product.images ? product.images.map(img => img.src) : [],
      description: product.description || product.short_description || '',
      category: product.categories && product.categories.length > 0
        ? product.categories[0].name
        : 'Uncategorized',
      rating: product.average_rating ? parseFloat(product.average_rating) : 0,
      stockStatus: product.stock_status,
      inStock: product.stock_status === 'instock',
      product: product,
    };
  }

  // Get all categories
  async getCategories(params = {}) {
    // Build query params properly
    const queryParams = new URLSearchParams();
    queryParams.append('per_page', params.per_page || 100);
    queryParams.append('page', params.page || 1);
    
    // Add any additional params (excluding per_page and page to avoid duplicates)
    Object.keys(params).forEach(key => {
      if (key !== 'per_page' && key !== 'page' && params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const categories = await this.request(`/products/categories?${queryParams.toString()}`);
    
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image ? category.image.src : null,
      count: category.count || 0,
    }));
  }

  // Get user data (customer)
  async getUser(userId) {
    if (this.authToken) {
      return await this.request(`/customers/${userId}`);
    }
    throw new Error('Authentication required');
  }

  // Get current user's orders
  async getUserOrders() {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }
    
    // Note: This requires custom endpoint or WooCommerce extension
    // For now, we'll use a placeholder
    return [];
  }
}

export const wooCommerceAPI = new WooCommerceAPI();


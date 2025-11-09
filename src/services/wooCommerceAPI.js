import { encode } from 'base-64';

// ✅ WooCommerce API Configuration
const WOOCOMMERCE_STORE_URL = 'https://aarsunwoods.in/0newsite/index.php'; // ✅ Updated to include index.php
const CONSUMER_KEY = 'ck_6ea297ed4a600153000c4108f7f11c3360d0a1d5';
const CONSUMER_SECRET = 'cs_f29e45ef10f9b35140588c64d62d8417f840f959';

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

    // Use Bearer if logged in, else use Basic Auth
    // Always use Basic Auth for product/category fetching (public data)
		if (endpoint.startsWith('/products')) {
		  headers['Authorization'] = `Basic ${this.getBasicAuth()}`;
		} else if (this.authToken) {
		  headers['Authorization'] = `Bearer ${this.authToken}`;
		} else {
		  headers['Authorization'] = `Basic ${this.getBasicAuth()}`;
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
        endpoint: endpoint,
      });
      throw error;
    }
  }

  // ✅ Authentication endpoints (using JWT Auth Plugin)
  async login(username, password) {
    try {
      const cleanStoreURL = WOOCOMMERCE_STORE_URL.replace(/\/$/, '');
      const response = await fetch(`${cleanStoreURL}/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
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

      // ✅ Fetch user details using token
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

      // ✅ Automatically log in after registration
      const loginResult = await this.login(username, password);
      return loginResult;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // ✅ Fetch products
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams();
    queryParams.append('per_page', params.per_page || 100);
    queryParams.append('page', params.page || 1);

    Object.keys(params).forEach((key) => {
      if (key !== 'per_page' && key !== 'page' && params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const products = await this.request(`/products?${queryParams.toString()}`);
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image:
        product.images && product.images.length > 0
          ? product.images[0].src
          : 'https://via.placeholder.com/500',
      description: product.description || product.short_description || '',
      category:
        product.categories && product.categories.length > 0
          ? product.categories[0].name
          : 'Uncategorized',
      rating: product.average_rating ? parseFloat(product.average_rating) : 0,
      stockStatus: product.stock_status,
      inStock: product.stock_status === 'instock',
      product: product,
    }));
  }

  // ✅ Fetch single product
  async getProduct(id) {
    const product = await this.request(`/products/${id}`);
    return {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image:
        product.images && product.images.length > 0
          ? product.images[0].src
          : 'https://via.placeholder.com/500',
      images: product.images ? product.images.map((img) => img.src) : [],
      description: product.description || product.short_description || '',
      category:
        product.categories && product.categories.length > 0
          ? product.categories[0].name
          : 'Uncategorized',
      rating: product.average_rating ? parseFloat(product.average_rating) : 0,
      stockStatus: product.stock_status,
      inStock: product.stock_status === 'instock',
      product: product,
    };
  }

  // ✅ Fetch categories
  async getCategories(params = {}) {
    const queryParams = new URLSearchParams();
    queryParams.append('per_page', params.per_page || 100);
    queryParams.append('page', params.page || 1);

    Object.keys(params).forEach((key) => {
      if (key !== 'per_page' && key !== 'page' && params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const categories = await this.request(`/products/categories?${queryParams.toString()}`);
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image ? category.image.src : null,
      count: category.count || 0,
    }));
  }

  // ✅ Fetch user data
  async getUser(userId) {
    if (this.authToken) {
      return await this.request(`/customers/${userId}`);
    }
    throw new Error('Authentication required');
  }

  // ✅ Fetch user orders
  async getUserOrders() {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }
    return [];
  }
}

export const wooCommerceAPI = new WooCommerceAPI();

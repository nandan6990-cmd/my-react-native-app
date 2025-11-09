# WooCommerce API Setup Guide

This app uses the WooCommerce REST API to fetch products, categories, and handle user authentication. Follow these steps to configure your WooCommerce store:

## Step 1: Enable WooCommerce REST API

1. Log in to your WordPress admin panel
2. Go to **WooCommerce** → **Settings** → **Advanced** → **REST API**
3. Click **Add Key**
4. Fill in the details:
   - **Description**: ecommerce-app (or any name you prefer)
   - **User**: Select a user with appropriate permissions
   - **Permissions**: Read/Write (for full functionality)
5. Click **Generate API Key**
6. **Copy the Consumer Key and Consumer Secret** - you'll need these!

## Step 2: Install JWT Authentication Plugin (for Login)

For user authentication to work, you need to install a JWT authentication plugin:

1. Install **JWT Authentication for WP REST API** plugin
   - You can find it in the WordPress plugin repository
   - Or download from: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/

2. After installation, add this to your `wp-config.php` file (before "That's all, stop editing!"):
   ```php
   define('JWT_AUTH_SECRET_KEY', 'your-secret-key-here');
   define('JWT_AUTH_CORS_ENABLE', true);
   ```
   Generate a secret key using: https://api.wordpress.org/secret-key/1.1/salt/

## Step 3: Configure the App

Open `ecommerce/src/services/wooCommerceAPI.js` and update the following constants:

```javascript
const WOOCOMMERCE_STORE_URL = 'https://your-store.com'; // Your WooCommerce store URL
const CONSUMER_KEY = 'ck_your_consumer_key'; // Your Consumer Key from Step 1
const CONSUMER_SECRET = 'cs_your_consumer_secret'; // Your Consumer Secret from Step 1
```

**Important**: 
- Replace `https://your-store.com` with your actual WooCommerce store URL
- Replace `ck_your_consumer_key` with your actual Consumer Key
- Replace `cs_your_consumer_secret` with your actual Consumer Secret

## Step 4: Test the Connection

1. Start your app: `npm start`
2. Try to log in or register a new account
3. Check if products and categories load correctly

## Troubleshooting

### API Connection Issues
- Verify your store URL is correct and accessible
- Check that WooCommerce REST API is enabled
- Ensure Consumer Key and Secret are correct
- Check if your store requires SSL (HTTPS)

### Authentication Issues
- Verify JWT Authentication plugin is installed and activated
- Check that `JWT_AUTH_SECRET_KEY` is set in `wp-config.php`
- Ensure CORS is enabled for your domain

### Product/Category Loading Issues
- Check WooCommerce REST API permissions (should be Read/Write)
- Verify products and categories exist in your WooCommerce store
- Check browser/device console for error messages

## API Endpoints Used

- **Products**: `/wp-json/wc/v3/products`
- **Categories**: `/wp-json/wc/v3/products/categories`
- **Customers**: `/wp-json/wc/v3/customers`
- **Authentication**: `/wp-json/jwt-auth/v1/token`
- **User Info**: `/wp-json/wp/v2/users/me`

## Security Notes

- Never commit your Consumer Key and Secret to version control
- Consider using environment variables for sensitive data
- Use HTTPS for all API communications
- Regularly rotate your API keys


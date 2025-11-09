# Luxury Furniture Ecommerce App

A fully functional furniture ecommerce mobile application built with React Native and Expo. Features an elegant beige and golden color theme perfect for showcasing luxury furniture products.

## Features

- 🏠 **Home Screen** - Featured furniture products showcase
- 🛍️ **Products Screen** - Browse furniture by room category (Living Room, Dining Room, Bedroom, Office)
- 📱 **Product Details** - Detailed product information with elegant design
- 🛒 **Shopping Cart** - Add, remove, and manage cart items
- 💳 **Checkout** - Complete order placement with form validation
- 📊 **State Management** - Context API for cart management
- 🎨 **Elegant UI** - Beautiful beige and golden color theme with sophisticated design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## Project Structure

```
ecommerce/
├── App.js                 # Main app entry point
├── src/
│   ├── components/        # Reusable components
│   │   ├── ProductCard.js
│   │   ├── CartItem.js
│   │   └── Header.js
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.js
│   │   ├── ProductsScreen.js
│   │   ├── ProductDetailsScreen.js
│   │   ├── CartScreen.js
│   │   └── CheckoutScreen.js
│   ├── navigation/        # Navigation setup
│   │   └── AppNavigator.js
│   ├── context/           # Context providers
│   │   └── CartContext.js
│   └── data/              # Sample data
│       └── products.js
├── package.json
└── README.md
```

## Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **Context API** - State management
- **React Hooks** - Modern React patterns

## Features in Detail

### Shopping Cart
- Add products to cart
- Update quantities
- Remove items
- View cart total
- Cart badge indicator

### Product Management
- Category filtering by room type (Living Room, Dining Room, Bedroom, Office)
- Furniture product browsing
- Detailed product information with descriptions
- Rating display for each product

### Checkout Process
- Shipping information form
- Payment information form
- Order summary
- Form validation

## Design Theme

The app features a sophisticated beige and golden color palette:
- **Beige tones**: #F5F5DC, #E8E4D6, #D4C4A8, #C9B99B
- **Golden accents**: #D4AF37, #F4D03F, #C9A961
- **Text colors**: #5C4A37, #8B7355

## Customization

You can easily customize:
- Furniture product data in `src/data/products.js`
- Styling in component StyleSheet objects
- Color theme throughout the app
- Add more screens and features

## Future Enhancements

- User authentication
- Product search functionality
- Wishlist feature
- Order history
- Payment gateway integration
- Backend API integration
- Push notifications

## License

This project is open source and available under the MIT License.


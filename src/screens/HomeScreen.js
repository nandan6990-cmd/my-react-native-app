import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { wooCommerceAPI } from '../services/wooCommerceAPI';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';

const HomeScreen = ({ navigation }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const products = await wooCommerceAPI.getProducts({ per_page: 4 });
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      Alert.alert(
        'Error Loading Products', 
        `Failed to load products: ${errorMessage}\n\nPlease check:\n- Your WooCommerce API credentials\n- Network connection\n- Store URL is accessible`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="AARSUN WOODS PVT. LTD." navigation={navigation} />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#D4AF37" />
              <Text style={styles.loadingText}>Loading products...</Text>
            </View>
          ) : (
            <View style={styles.productGrid}>
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() =>
                    navigation.navigate('ProductDetails', { product })
                  }
                />
              ))}
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.viewAllButton, styles.button]}
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={styles.viewAllButtonText}>Browse Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewAllButton, styles.button]}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.viewAllButtonText}>View All Products</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#5C4A37',
    letterSpacing: 0.5,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  viewAllButton: {
    backgroundColor: '#D4AF37',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C9A961',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  viewAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8B7355',
  },
});

export default HomeScreen;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { wooCommerceAPI } from '../services/wooCommerceAPI';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';

const ProductsScreen = ({ navigation, route }) => {
  const initialCategory = route?.params?.selectedCategory || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route?.params?.selectedCategory) {
      setSelectedCategory(route.params.selectedCategory);
    }
  }, [route?.params?.selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await wooCommerceAPI.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      Alert.alert(
        'Error Loading Products', 
        `Failed to load products: ${errorMessage}\n\nPlease check:\n- Your WooCommerce API credentials\n- Network connection\n- Store URL is accessible`
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <View style={styles.container}>
      <Header title="Products" navigation={navigation} />
      <View style={styles.categoryHeader}>
        <TouchableOpacity
          style={styles.browseCategoriesButton}
          onPress={() => navigation.navigate('Categories')}
        >
          <Text style={styles.browseCategoriesText}>Browse All Categories</Text>
        </TouchableOpacity>
        {selectedCategory !== 'All' && (
          <View style={styles.selectedCategoryInfo}>
            <Text style={styles.selectedCategoryText}>
              Showing: {selectedCategory}
            </Text>
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={() => setSelectedCategory('All')}
            >
              <Text style={styles.clearFilterText}>Clear Filter</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((product) => (
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  categoryHeader: {
    backgroundColor: '#E8E4D6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  },
  browseCategoriesButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#C9A961',
    marginBottom: 8,
  },
  browseCategoriesText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  selectedCategoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  selectedCategoryText: {
    fontSize: 16,
    color: '#5C4A37',
    fontWeight: '600',
  },
  clearFilterButton: {
    backgroundColor: '#C9B99B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D4C4A8',
  },
  clearFilterText: {
    color: '#5C4A37',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8B7355',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#8B7355',
  },
});

export default ProductsScreen;


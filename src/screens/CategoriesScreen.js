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
import { getCategoryIcon } from '../data/categories';
import Header from '../components/Header';

const CategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await wooCommerceAPI.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      Alert.alert(
        'Error Loading Categories', 
        `Failed to load categories: ${errorMessage}\n\nPlease check:\n- Your WooCommerce API credentials\n- Network connection\n- Store URL is accessible`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('Products', { selectedCategory: category.name || category });
  };

  return (
    <View style={styles.container}>
      <Header title="Categories" navigation={navigation} />
      <ScrollView style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Browse by Category</Text>
          <Text style={styles.headerSubtitle}>
            Explore our {categories.length} furniture categories
          </Text>
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : categories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        ) : (
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryIcon}>
                    {getCategoryIcon(category.name)}
                  </Text>
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {category.name}
                </Text>
                {category.count > 0 && (
                  <Text style={styles.categoryCount}>{category.count} items</Text>
                )}
              </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  headerSection: {
    padding: 20,
    backgroundColor: '#E8E4D6',
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5C4A37',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8B7355',
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 12,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: '#F5F5DC',
    borderRadius: 12,
    margin: 6,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8E4D6',
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#C9A961',
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C4A37',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  categoryCount: {
    fontSize: 12,
    color: '#8B7355',
    marginTop: 4,
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

export default CategoriesScreen;


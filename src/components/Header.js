import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ title, navigation, showCart = true }) => {
  // Always call hooks at the top
  const { getCartItemCount } = useCart();
  
  let auth = {};
  try {
    auth = useAuth(); // Safely call inside try in case context is missing during early render
  } catch (e) {
    console.warn('AuthContext not available yet');
  }

  const { logout, isAuthenticated } = auth;
  const cartCount = getCartItemCount();

 const handleLogout = async () => {
  await logout();
  // Safely redirect to Home after logout
  const parent = navigation.getParent();
  if (parent) {
    parent.navigate('HomeTab');
  } else {
    navigation.navigate('HomeTab');
  }
};



  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightContainer}>
        {showCart && (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => {
              try {
                const parent = navigation.getParent();
                if (parent) {
                  parent.navigate('CartTab');
                } else {
                  navigation.navigate('CartTab');
                }
              } catch (error) {
                navigation.navigate('CartTab');
              }
            }}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {isAuthenticated && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#D4C4A8',
    paddingTop: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5C4A37',
    letterSpacing: 0.5,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: '#D4AF37',
    borderRadius: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#C9A961',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#C9B99B',
    borderRadius: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4C4A8',
    marginLeft: 8,
  },
  logoutIcon: {
    fontSize: 20,
  },
});

export default Header;

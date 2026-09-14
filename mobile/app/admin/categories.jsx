import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Pressable, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import API_URL from '../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminCategoriesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/categories`);
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn("Server returned non-JSON:", text.substring(0, 50));
        return;
      }

      const categoriesData = data.categories || data.categoies;
      if (response.ok && categoriesData) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = async (id, currentStatus) => {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/categories/${id}/toggle`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Optimistic UI update
        setCategories(categories.map(c => 
          c._id === id ? { ...c, isActive: !currentStatus } : c
        ));
      } else {
        Alert.alert("Error", "Failed to toggle category.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#171717" />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Categories</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#F47D5B" />
        ) : (
          categories.map((category) => (
            <View key={category._id} style={styles.categoryCard}>
              <View style={styles.iconBox}>
                <Ionicons name={category.icon || "list"} size={24} color="#F47D5B" />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDesc}>{category.description || "No description"}</Text>
              </View>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>{category.isActive ? "Active" : "Hidden"}</Text>
                <Switch
                  trackColor={{ false: "#D1D5DB", true: "#34D399" }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D5DB"
                  onValueChange={() => toggleCategory(category._id, category.isActive)}
                  value={category.isActive}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#171717' },
  content: { padding: 20 },
  categoryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#FFF9F7', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  categoryInfo: { flex: 1 },
  categoryName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  categoryDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  toggleContainer: { alignItems: 'flex-end' },
  toggleText: { fontSize: 10, color: '#9CA3AF', marginBottom: 4, fontWeight: '600' }
});

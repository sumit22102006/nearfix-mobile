import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Pressable, Switch, Alert, Modal, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import API_URL from '../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminCategoriesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '', icon: 'construct' });
  const [submitting, setSubmitting] = useState(false);

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

  const handleCreateCategory = async () => {
    if (!newCat.name.trim()) {
      Alert.alert("Error", "Category name is required.");
      return;
    }

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCat),
      });

      const data = await response.json();
      
      if (response.ok) {
        setModalVisible(false);
        setNewCat({ name: '', description: '', icon: 'construct' });
        fetchCategories(); // Refresh list
        Alert.alert("Success", "Category created successfully.");
      } else {
        Alert.alert("Error", data.message || "Failed to create category.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setSubmitting(false);
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

      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </Pressable>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Category</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </Pressable>
            </View>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Plumber"
              value={newCat.name}
              onChangeText={(text) => setNewCat({ ...newCat, name: text })}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Expert plumbing services"
              value={newCat.description}
              onChangeText={(text) => setNewCat({ ...newCat, description: text })}
            />

            <Text style={styles.label}>Icon (Ionicons name)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. construct, water, flash"
              value={newCat.icon}
              onChangeText={(text) => setNewCat({ ...newCat, icon: text })}
            />

            <Pressable 
              style={[styles.submitButton, submitting && { opacity: 0.7 }]} 
              onPress={handleCreateCategory}
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Create Category</Text>}
            </Pressable>
          </View>
        </View>
      </Modal>
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
  toggleText: { fontSize: 10, color: '#9CA3AF', marginBottom: 4, fontWeight: '600' },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, height: 52, fontSize: 16, color: '#111827', marginBottom: 16 },
  submitButton: { backgroundColor: '#F47D5B', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import API_URL from '../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminProvidersScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/providers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        return;
      }

      if (response.ok && data.providers) {
        setProviders(data.providers);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#171717" />
        </Pressable>
        <Text style={styles.headerTitle}>All Professionals ({providers.length})</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#DC2626" />
        ) : (
          providers.map((provider) => (
            <View key={provider._id} style={styles.providerCard}>
              <View style={styles.providerHeader}>
                <View style={styles.providerInfo}>
                  <Text style={styles.businessName}>{provider.businessName}</Text>
                  <Text style={styles.ownerName}>{provider.userId?.name}</Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{provider.categoryId?.name}</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.statText}>{provider.rating || 0}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="briefcase" size={14} color="#4F46E5" />
                  <Text style={styles.statText}>{provider.totalReviews || 0} Jobs</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="pricetag" size={14} color="#10B981" />
                  <Text style={styles.statText}>${provider.price}/hr</Text>
                </View>
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
  providerCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  providerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  providerInfo: { flex: 1 },
  businessName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  ownerName: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  categoryBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryText: { fontSize: 10, fontWeight: '700', color: '#DC2626' },
  statsRow: { flexDirection: 'row', gap: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  stat: { flexDirection: 'row', alignItems: 'center' },
  statText: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginLeft: 4 }
});

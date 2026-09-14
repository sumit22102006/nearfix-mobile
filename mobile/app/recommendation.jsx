import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, SafeAreaView, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import API_URL from '../api/config';

export default function RecommendationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { category, service, latitude, longitude, location } = params;

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // If no category is directly passed, try to use service as category
  const searchCategory = category || service || "Plumber";

  useEffect(() => {
    const searchProviders = async () => {
      try {
        setLoading(true);
        let url = `${API_URL}/api/providers/search?category=${encodeURIComponent(searchCategory)}`;
        
        if (latitude && longitude) {
          url += `&latitude=${latitude}&longitude=${longitude}`;
        }

        const response = await fetch(url);
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.warn("Server returned non-JSON:", text.substring(0, 50));
          return;
        }

        if (response.ok && data.providers) {
          setProviders(data.providers);
        } else {
          setProviders([]);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    searchProviders();
  }, [searchCategory, latitude, longitude]);

  const renderProvider = ({ item }) => (
    <Pressable 
      style={styles.card}
      onPress={() => router.push(`/provider/${item._id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={32} color="#F47D5B" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.businessName}>{item.businessName}</Text>
          <Text style={styles.providerName}>{item.userId?.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>
              {item.rating || "New"} ({item.reviewsCount || 0} reviews)
            </Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.priceLabel}>/hr</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.footerText} numberOfLines={1}>
            {item.location?.address || "Unknown location"}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="briefcase-outline" size={16} color="#6B7280" />
          <Text style={styles.footerText}>{item.experience} yrs exp</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#171717" />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Results for "{searchCategory}"</Text>
          {location ? <Text style={styles.headerSubtitle}>{location}</Text> : null}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#F47D5B" />
          <Text style={styles.loadingText}>Finding best professionals...</Text>
        </View>
      ) : providers.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="search-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No professionals found in this area.</Text>
        </View>
      ) : (
        <FlatList
          data={providers}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={renderProvider}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF9F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  providerName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 4,
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F47D5B',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    gap: 16,
  },
  footerItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, SafeAreaView, Alert, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import API_URL from '../../api/config';
import { useAuth } from '../../context/AuthContext';

export default function ProviderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/providers/${id}`);
        const data = await response.json();

        if (response.ok && data.provider) {
          setProvider(data.provider);
        } else {
          Alert.alert("Error", "Provider not found");
          router.back();
        }
      } catch (error) {
        console.error("Fetch provider error:", error);
        Alert.alert("Error", "Failed to load provider details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProvider();
    }
  }, [id]);

  const handleBook = () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to book a service.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/login") }
      ]);
      return;
    }

    // Pass the provider details to a booking screen that we will create in Phase 4
    router.push({
      pathname: "/booking/create",
      params: { 
        providerId: provider._id,
        businessName: provider.businessName,
        price: provider.price,
        serviceName: provider.categoryId?.name
      }
    });
  };

  if (loading || !provider) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F47D5B" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#171717" />
        </Pressable>
        <Text style={styles.headerTitle}>Professional Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={48} color="#F47D5B" />
          </View>
          <Text style={styles.businessName}>{provider.businessName}</Text>
          <Text style={styles.providerName}>{provider.userId?.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {provider.categoryId?.name ? provider.categoryId.name.toUpperCase() : 'SERVICE'}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="star" size={24} color="#F59E0B" />
            <Text style={styles.statValue}>{provider.rating || "New"}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Ionicons name="briefcase" size={24} color="#4F46E5" />
            <Text style={styles.statValue}>{provider.experience || 0} Yrs</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <MaterialIcons name="attach-money" size={24} color="#10B981" />
            <Text style={styles.statValue}>${provider.price}/hr</Text>
            <Text style={styles.statLabel}>Rate</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {provider.description || "This professional has not provided a description yet."}
          </Text>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={20} color="#F47D5B" />
            <Text style={styles.locationText}>
              {provider.location?.address || "Location not provided"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>${provider.price}</Text>
          <Text style={styles.priceSubtext}>per hour</Text>
        </View>
        <Pressable style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
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
  content: {
    paddingBottom: 100, // padding for bottom bar
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF9F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
  businessName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#F47D5B',
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationText: {
    flex: 1,
    fontSize: 15,
    color: '#4B5563',
    marginLeft: 8,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  priceContainer: {
    flex: 1,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  priceSubtext: {
    fontSize: 13,
    color: '#6B7280',
  },
  bookButton: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

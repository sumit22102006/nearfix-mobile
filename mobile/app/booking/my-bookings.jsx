import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import API_URL from '../../api/config';
import { useAuth } from '../../context/AuthContext';

export default function MyBookingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/bookings/my`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn("Server returned non-JSON:", text.substring(0, 50));
        return;
      }

      if (response.ok && data.bookings) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Fetch bookings error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#F59E0B'; // yellow
      case 'accepted': return '#3B82F6'; // blue
      case 'completed': return '#10B981'; // green
      case 'rejected':
      case 'cancelled': return '#EF4444'; // red
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F47D5B" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#171717" />
        </Pressable>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
            <Text style={styles.emptyDesc}>You haven't requested any services yet.</Text>
            <Pressable style={styles.exploreButton} onPress={() => router.replace('/')}>
              <Text style={styles.exploreButtonText}>Explore Professionals</Text>
            </Pressable>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking._id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.businessName}>
                  {booking.providerId?.businessName || "Unknown Professional"}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                    {booking.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {new Date(booking.serviceDate).toLocaleDateString()} at {new Date(booking.serviceDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={16} color="#6B7280" />
                  <Text style={styles.detailText} numberOfLines={1}>{booking.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="pricetag" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>${booking.price}/hr</Text>
                </View>
              </View>

              {booking.notes ? (
                <View style={styles.notesBox}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{booking.notes}</Text>
                </View>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#F47D5B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  bookingDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
  },
  notesBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#4B5563',
    fontStyle: 'italic',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import API_URL from '../../api/config';
import { useAuth } from '../../context/AuthContext';

export default function ProviderBookingsScreen() {
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
      const response = await fetch(`${API_URL}/api/bookings/provider`, {
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
      console.error("Fetch provider bookings error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        Alert.alert("Success", `Booking marked as ${newStatus}`);
        fetchBookings(); // Refresh list
      } else {
        Alert.alert("Error", "Failed to update booking.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong.");
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
        <Text style={styles.headerTitle}>Job Requests</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Jobs Yet</Text>
            <Text style={styles.emptyDesc}>When customers book your service, they will appear here.</Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking._id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.customerName}>
                  {booking.userId?.name || "Unknown Customer"}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: booking.status === 'pending' ? '#FEF3C7' : '#F3F4F6' }]}>
                  <Text style={[styles.statusText, { color: booking.status === 'pending' ? '#D97706' : '#6B7280' }]}>
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
                  <Text style={styles.detailText}>{booking.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="call" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{booking.userId?.phone || "No phone number"}</Text>
                </View>
              </View>

              {booking.notes ? (
                <View style={styles.notesBox}>
                  <Text style={styles.notesLabel}>Customer Issue:</Text>
                  <Text style={styles.notesText}>{booking.notes}</Text>
                </View>
              ) : null}

              {/* Action Buttons based on status */}
              {booking.status === 'pending' && (
                <View style={styles.actionsRow}>
                  <Pressable 
                    style={[styles.actionButton, styles.declineButton]} 
                    onPress={() => handleUpdateStatus(booking._id, 'rejected')}
                  >
                    <Text style={styles.declineText}>Decline</Text>
                  </Pressable>
                  <Pressable 
                    style={[styles.actionButton, styles.acceptButton]} 
                    onPress={() => handleUpdateStatus(booking._id, 'accepted')}
                  >
                    <Text style={styles.acceptText}>Accept Job</Text>
                  </Pressable>
                </View>
              )}

              {booking.status === 'accepted' && (
                <View style={styles.actionsRow}>
                  <Pressable 
                    style={[styles.actionButton, styles.completeButton]} 
                    onPress={() => handleUpdateStatus(booking._id, 'completed')}
                  >
                    <Text style={styles.completeText}>Mark as Completed</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#171717' },
  scrollContent: { padding: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 16 },
  emptyDesc: { fontSize: 15, color: '#6B7280', marginTop: 8, textAlign: 'center' },
  bookingCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  customerName: { fontSize: 16, fontWeight: '700', color: '#111827', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800' },
  bookingDetails: { gap: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  detailText: { fontSize: 14, color: '#4B5563', marginLeft: 8, flex: 1 },
  notesBox: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  notesLabel: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', marginBottom: 4 },
  notesText: { fontSize: 14, color: '#4B5563', fontStyle: 'italic' },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  actionButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  declineButton: { backgroundColor: '#FEF2F2' },
  declineText: { color: '#EF4444', fontWeight: '600' },
  acceptButton: { backgroundColor: '#F47D5B' },
  acceptText: { color: '#FFFFFF', fontWeight: '700' },
  completeButton: { backgroundColor: '#10B981' },
  completeText: { color: '#FFFFFF', fontWeight: '700' },
});

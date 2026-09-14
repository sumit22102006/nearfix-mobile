import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import API_URL from '../../api/config';
import { useAuth } from '../../context/AuthContext';

export default function CreateBookingScreen() {
  const router = useRouter();
  const { providerId, businessName, price, serviceName } = useLocalSearchParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const [form, setForm] = useState({
    date: new Date(),
    address: '',
    notes: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleGetLocation = async () => {
    try {
      setFetchingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to use your current location.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = currentLocation.coords;

      const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      let formattedAddress = "";
      if (addressResponse.length > 0) {
        const place = addressResponse[0];
        formattedAddress = [place.name, place.street, place.city, place.region].filter(Boolean).join(", ");
      }

      setForm({ ...form, address: formattedAddress });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to get current location.');
    } finally {
      setFetchingLocation(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const currentDate = new Date(form.date);
      currentDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setForm({ ...form, date: currentDate });
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const currentDate = new Date(form.date);
      currentDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setForm({ ...form, date: currentDate });
    }
  };

  const handleSubmit = async () => {
    if (!form.address) {
      Alert.alert("Missing Fields", "Please provide a service address.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          providerId,
          serviceDate: form.date.toISOString(),
          address: form.address,
          notes: form.notes,
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn("Server returned non-JSON:", text.substring(0, 50));
        Alert.alert("Error", "Server error. Please try again.");
        return;
      }

      if (response.ok) {
        Alert.alert("Success!", "Your booking request has been sent to the professional.", [
          { text: "View My Bookings", onPress: () => router.replace('/booking/my-bookings') }
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to create booking.");
      }
    } catch (error) {
      console.error("Create booking error:", error);
      Alert.alert("Error", "Something went wrong.");
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
        <Text style={styles.headerTitle}>Request Service</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="construct" size={24} color="#4F46E5" />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.businessName}>{businessName}</Text>
              <Text style={styles.serviceName}>{serviceName?.toUpperCase()}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>${price}/hr</Text>
            </View>
          </View>

          <Text style={styles.label}>When do you need it? <Text style={styles.required}>*</Text></Text>
          <View style={styles.dateTimeRow}>
            <Pressable style={styles.dateTimeBox} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
              <Text style={styles.dateTimeText}>{form.date.toLocaleDateString()}</Text>
            </Pressable>
            <Pressable style={styles.dateTimeBox} onPress={() => setShowTimePicker(true)}>
              <Ionicons name="time-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
              <Text style={styles.dateTimeText}>{form.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </Pressable>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={form.date}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={form.date}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}

          <Text style={styles.label}>Service Address <Text style={styles.required}>*</Text></Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="123 Main St, City"
              value={form.address}
              onChangeText={(text) => setForm({ ...form, address: text })}
            />
            <Pressable style={styles.locationButton} onPress={handleGetLocation} disabled={fetchingLocation}>
              {fetchingLocation ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name="locate" size={20} color="#FFFFFF" />}
            </Pressable>
          </View>

          <Text style={styles.label}>Describe the Problem (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="E.g., The sink is leaking under the cabinet..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={form.notes}
            onChangeText={(text) => setForm({ ...form, notes: text })}
          />

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomBar}>
        <Pressable 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Send Request</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
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
    paddingBottom: 100,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  summaryInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  serviceName: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  priceTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateTimeBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginHorizontal: 4,
  },
  dateTimeText: {
    fontSize: 15,
    color: '#111827',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 16,
    color: '#111827',
    marginBottom: 20,
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationButton: {
    backgroundColor: '#111827',
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#F47D5B',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

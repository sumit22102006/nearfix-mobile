import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import API_URL from '../../api/config';
import { useAuth } from '../../context/AuthContext';

export default function ProviderOnboardingScreen() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const [form, setForm] = useState({
    categoryId: '',
    businessName: '',
    description: '',
    experience: '',
    price: '',
    address: '',
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();
        const categoriesData = data.categories || data.categoies;
        if (response.ok && categoriesData) {
          setCategories(categoriesData);
        } else {
          console.warn("Failed to load categories:", data);
        }
      } catch (error) {
        console.error("Fetch categories error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleGetLocation = async () => {
    try {
      setFetchingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to set your service area.');
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

      setForm({ ...form, latitude, longitude, address: formattedAddress });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to get current location.');
    } finally {
      setFetchingLocation(false);
    }
  };

  const handleSubmit = async () => {
    let currentLat = form.latitude;
    let currentLng = form.longitude;

    if (!currentLat && form.address) {
      try {
        setLoading(true);
        const geocode = await Location.geocodeAsync(form.address);
        if (geocode.length > 0) {
          currentLat = geocode[0].latitude;
          currentLng = geocode[0].longitude;
          setForm({ ...form, latitude: currentLat, longitude: currentLng });
        }
      } catch (error) {
        console.log("Geocoding failed", error);
      } finally {
        setLoading(false);
      }
    }

    const missing = [];
    if (!form.categoryId) missing.push("Category (Please tap one)");
    if (!form.businessName) missing.push("Business Name");
    if (!form.address) missing.push("Address");

    if (missing.length > 0) {
      Alert.alert("Missing Fields", `Please complete the following:\n- ${missing.join('\n- ')}`);
      return;
    }

    // Fallback for emulator testing: if geocoding failed and no GPS, use 0,0
    if (currentLat === null || currentLng === null) {
      console.log("Using fallback coordinates for testing");
      currentLat = 0;
      currentLng = 0;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/providers/become`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          categoryId: form.categoryId,
          businessName: form.businessName,
          description: form.description,
          experience: Number(form.experience) || 0,
          price: Number(form.price) || 0,
          location: {
            latitude: currentLat,
            longitude: currentLng,
            address: form.address,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update user context with new role
        const updatedUser = { ...user, roles: [...(user.roles || []), "provider"] };
        setUser(updatedUser);
        
        Alert.alert("Success!", "You are now a NearFix Professional!", [
          { text: "Go to Dashboard", onPress: () => router.replace('/provider/dashboard') }
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to register as a professional.");
      }
    } catch (error) {
      console.error("Become professional error:", error);
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
        <Text style={styles.headerTitle}>Become a Professional</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <Text style={styles.infoText}>
              Start earning by offering your services to thousands of customers near you!
            </Text>
          </View>

          <Text style={styles.label}>Business or Profile Name <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. John's Plumbing Services"
            value={form.businessName}
            onChangeText={(text) => setForm({ ...form, businessName: text })}
          />

          <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
          <View style={[styles.categoryGrid, categories.length === 0 && { justifyContent: 'center', padding: 20 }]}>
            {categories.length === 0 ? (
              <Text style={{ color: '#6B7280', fontStyle: 'italic' }}>Loading categories...</Text>
            ) : (
              categories.map((cat) => (
                <Pressable 
                  key={cat._id}
                  style={[
                    styles.categoryCard, 
                    form.categoryId === cat._id && styles.categoryCardSelected,
                    { margin: 4 } // Fallback for gap in older RN
                  ]}
                  onPress={() => setForm({ ...form, categoryId: cat._id })}
                >
                  <Text style={[styles.categoryText, form.categoryId === cat._id && styles.categoryTextSelected]}>
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </Text>
                </Pressable>
              ))
            )}
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Hourly Rate ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={form.price}
                onChangeText={(text) => setForm({ ...form, price: text })}
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Experience (Years)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={form.experience}
                onChangeText={(text) => setForm({ ...form, experience: text })}
              />
            </View>
          </View>

          <Text style={styles.label}>Location <Text style={styles.required}>*</Text></Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Your service address"
              value={form.address}
              onChangeText={(text) => setForm({ ...form, address: text })}
            />
            <Pressable style={styles.locationButton} onPress={handleGetLocation} disabled={fetchingLocation}>
              {fetchingLocation ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name="locate" size={20} color="#FFFFFF" />}
            </Pressable>
          </View>

          <Text style={styles.label}>About You / Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell customers about your skills and why they should hire you..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
          />

          <Pressable 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Register as Professional</Text>
            )}
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 40,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    color: '#1E3A8A',
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  categoryCardSelected: {
    backgroundColor: '#F47D5B',
    borderColor: '#F47D5B',
  },
  categoryText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
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
  submitButton: {
    backgroundColor: '#F47D5B',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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

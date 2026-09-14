import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import API_URL from '../../../api/config';
import { useAuth } from '../../../context/AuthContext';

export default function CreateReviewScreen() {
  const router = useRouter();
  const { providerId, businessName } = useLocalSearchParams();
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Missing Rating", "Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      Alert.alert("Missing Comment", "Please write a review comment.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          providerId,
          rating,
          comment,
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
        Alert.alert("Success!", "Thank you for your feedback.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Create review error:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#171717" />
        </Pressable>
        <Text style={styles.headerTitle}>Write a Review</Text>
        <View style={{ width: 40 }} /> {/* balance header */}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.businessName}>Rate your experience with {businessName}</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Ionicons 
                  name={star <= rating ? "star" : "star-outline"} 
                  size={40} 
                  color={star <= rating ? "#F59E0B" : "#D1D5DB"} 
                  style={styles.starIcon}
                />
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Tell us more</Text>
          <TextInput
            style={styles.textArea}
            placeholder="How was the service? Would you recommend them?"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
          />

          <Pressable 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Review</Text>
            )}
          </Pressable>
        </View>
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
    justifyContent: 'space-between',
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
  },
  content: {
    padding: 24,
  },
  businessName: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  starIcon: {
    marginHorizontal: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    height: 160,
    fontSize: 16,
    color: '#111827',
    marginBottom: 24,
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

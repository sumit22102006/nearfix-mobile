import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const testimonials = [
  {
    id: '1',
    name: 'Rahul Kumar',
    review: 'Booked an electrician through NearFix and the technician arrived within 30 minutes. Very professional experience.',
    service: 'Electrician',
    rating: 5,
    avatar: 'R',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    review: 'The AC repair service was excellent. Transparent pricing and no hidden charges. Highly recommended!',
    service: 'AC Repair',
    rating: 5,
    avatar: 'P',
  },
  {
    id: '3',
    name: 'Amit Singh',
    review: 'Very easy to book and the plumber was very knowledgeable. Fixed my sink issue in no time.',
    service: 'Plumbing',
    rating: 4,
    avatar: 'A',
  },
];

export const TestimonialsSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>What Our Customers Say</Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {testimonials.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.stars}>
              {[...Array(item.rating)].map((_, i) => (
                <Ionicons key={i} name="star" size={16} color="#FFB800" />
              ))}
            </View>
            <Text style={styles.reviewText}>"{item.review}"</Text>
            
            <View style={styles.customerInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.avatar}</Text>
              </View>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.service}>Service: {item.service}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#171717',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1E5E1',
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 4,
  },
  reviewText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF9F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F47D5B',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F47D5B',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#171717',
  },
  service: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});

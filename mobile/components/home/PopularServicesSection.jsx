import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const services = [
  {
    id: '1',
    name: 'AC Repair',
    description: 'Expert AC repair and servicing',
    price: '499',
    rating: '4.8',
    reviews: '1.2k',
    icon: 'ac-unit',
  },
  {
    id: '2',
    name: 'Plumbing',
    description: 'Leakages, pipes, and fittings',
    price: '299',
    rating: '4.7',
    reviews: '850',
    icon: 'plumbing',
  },
  {
    id: '3',
    name: 'Electrician',
    description: 'Wiring, appliances, and repairs',
    price: '399',
    rating: '4.9',
    reviews: '2.1k',
    icon: 'electrical-services',
  },
  {
    id: '4',
    name: 'Home Cleaning',
    description: 'Deep cleaning and sanitization',
    price: '599',
    rating: '4.8',
    reviews: '3.4k',
    icon: 'cleaning-services',
  },
];

export const PopularServicesSection = ({ onExploreAll, onBookNow }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Services Near You</Text>
        <Pressable onPress={onExploreAll}>
          <Text style={styles.exploreAll}>Explore All →</Text>
        </Pressable>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {services.map((service) => (
          <View key={service.id} style={styles.card}>
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name={service.icon} size={48} color="#F47D5B" />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDesc} numberOfLines={1}>{service.description}</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.ratingBox}>
                  <Ionicons name="star" size={14} color="#FFB800" />
                  <Text style={styles.ratingText}>{service.rating}</Text>
                  <Text style={styles.reviewsText}>({service.reviews})</Text>
                </View>
              </View>

              <View style={styles.footerRow}>
                <View>
                  <Text style={styles.priceLabel}>Starting from</Text>
                  <Text style={styles.priceValue}>₹{service.price}</Text>
                </View>
                <Pressable 
                  style={({pressed}) => [styles.bookBtn, pressed && {opacity: 0.8}]}
                  onPress={() => onBookNow(service.name)}
                >
                  <Text style={styles.bookBtnText}>Book Now</Text>
                </Pressable>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#171717',
    maxWidth: '70%',
  },
  exploreAll: {
    fontSize: 14,
    color: '#F47D5B',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1E5E1',
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: '#FFF9F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1E5E1',
  },
  cardBody: {
    padding: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#171717',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#171717',
  },
  reviewsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#171717',
  },
  bookBtn: {
    backgroundColor: '#F47D5B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

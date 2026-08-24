import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const features = [
  {
    id: '1',
    title: 'Verified Professionals',
    description: 'Every professional is verified before joining NearFix.',
    icon: 'checkmark-circle-outline',
  },
  {
    id: '2',
    title: 'Transparent Pricing',
    description: 'Know the expected service cost before booking.',
    icon: 'pricetag-outline',
  },
  {
    id: '3',
    title: 'Nearby Professionals',
    description: 'Find skilled professionals available near your location.',
    icon: 'location-outline',
  },
  {
    id: '4',
    title: 'Easy Booking',
    description: 'Book your service in just a few clicks.',
    icon: 'calendar-outline',
  },
];

export const WhyChooseUsSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Why Choose NearFix?</Text>
      
      <View style={styles.grid}>
        {features.map((feature) => (
          <View key={feature.id} style={styles.card}>
            <View style={styles.iconWrapper}>
              <Ionicons name={feature.icon} size={24} color="#F47D5B" />
            </View>
            <Text style={styles.title}>{feature.title}</Text>
            <Text style={styles.description}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#171717',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1E5E1',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF9F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#171717',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});

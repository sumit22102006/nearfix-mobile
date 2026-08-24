import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const categories = [
  { id: '1', name: 'Electrician', icon: 'electrical-services', provider: MaterialIcons },
  { id: '2', name: 'Plumber', icon: 'plumbing', provider: MaterialIcons },
  { id: '3', name: 'AC Repair', icon: 'ac-unit', provider: MaterialIcons },
  { id: '4', name: 'Cleaning', icon: 'cleaning-services', provider: MaterialIcons },
  { id: '5', name: 'Carpenter', icon: 'hammer-wrench', provider: MaterialCommunityIcons },
  { id: '6', name: 'Painting', icon: 'format-paint', provider: MaterialIcons },
  { id: '7', name: 'Appliance', icon: 'kitchen', provider: MaterialIcons },
  { id: '8', name: 'Pest Control', icon: 'pest-control', provider: MaterialIcons },
];

export const CategoriesSection = ({ onViewAll, onCategoryPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Categories</Text>
        <Pressable onPress={onViewAll}>
          <Text style={styles.viewAll}>View All →</Text>
        </Pressable>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((item) => {
          const IconComponent = item.provider;
          return (
            <Pressable 
              key={item.id} 
              style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => onCategoryPress(item.name)}
            >
              <View style={styles.iconContainer}>
                <IconComponent name={item.icon} size={28} color="#F47D5B" />
              </View>
              <Text style={styles.cardText} numberOfLines={1}>{item.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#171717',
  },
  viewAll: {
    fontSize: 14,
    color: '#F47D5B',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: 85,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1E5E1',
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF9F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 12,
    color: '#171717',
    fontWeight: '600',
    textAlign: 'center',
  },
});

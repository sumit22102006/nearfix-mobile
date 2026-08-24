import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export const HeroSection = ({
  service,
  setService,
  location,
  setLocation,
  onGetCurrentLocation,
  onSearch,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>
        Find Trusted Local Services <Text style={styles.headlineHighlight}>Near You</Text>
      </Text>
      
      <Text style={styles.subtitle}>
        Book trusted electricians, plumbers, cleaners, AC technicians and other verified professionals at your doorstep.
      </Text>
      
      <View style={styles.searchCard}>
        
        <View style={styles.inputGroup}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="What service do you need?"
            placeholderTextColor="#9CA3AF"
            value={service}
            onChangeText={setService}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.inputGroup}>
          <Ionicons name="location-outline" size={20} color="#6B7280" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            placeholderTextColor="#9CA3AF"
            value={location}
            onChangeText={setLocation}
          />
          <Pressable 
            style={({pressed}) => [styles.myLocationBtn, pressed && {opacity: 0.7}]}
            onPress={onGetCurrentLocation}
          >
            <MaterialIcons name="my-location" size={20} color="#F47D5B" />
          </Pressable>
        </View>

        <Pressable 
          style={({pressed}) => [styles.searchBtn, pressed && {opacity: 0.9}]}
          onPress={onSearch}
        >
          <Text style={styles.searchBtnText}>Find a Service</Text>
        </Pressable>

      </View>

      <View style={styles.trustBanner}>
        <Text style={styles.trustText}>✓ Verified Professionals</Text>
        <Text style={styles.trustText}>✓ Transparent Pricing</Text>
        <Text style={styles.trustText}>✓ Trusted by Customers</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headline: {
    fontSize: 32,
    fontWeight: '900',
    color: '#171717',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  headlineHighlight: {
    color: '#F47D5B',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    lineHeight: 24,
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1E5E1',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#171717',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  myLocationBtn: {
    padding: 8,
    backgroundColor: '#FFF9F7',
    borderRadius: 12,
  },
  searchBtn: {
    backgroundColor: '#F47D5B',
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#F47D5B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trustBanner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
  },
  trustText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
});

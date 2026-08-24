import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const servicesList = [
  { id: '1', name: 'Electrician', emoji: '👷‍♂️', color: '#E0F2FE' },
  { id: '2', name: 'Dog Walker', emoji: '🐕‍🦺', color: '#FEF3C7' },
  { id: '3', name: 'Doctor', emoji: '👩🏻‍⚕️', color: '#F3E8FF' },
  { id: '4', name: 'Tutor', emoji: '👨🏻‍🏫', color: '#F3F4F6' },
  { id: '5', name: 'Baby Sitter', emoji: '🤱🏼', color: '#D1FAE5' },
  { id: '6', name: 'Pest Control', emoji: '🐞', color: '#FFEDD5' },
  { id: '7', name: 'Handyman', emoji: '🛠️', color: '#F1F5F9' },
  { id: '8', name: 'Home Cleaner', emoji: '🏠', color: '#FEF3C7' },
  { id: '9', name: 'Plumber', emoji: '🧑‍🔧', color: '#E0E7FF' },
  { id: '10', name: 'Barber', emoji: '💇‍♂️', color: '#E0F2FE' },
  { id: '11', name: 'Carpenter', emoji: '🪚', color: '#E0F2FE' },
  { id: '12', name: 'Massage', emoji: '💆‍♂️', color: '#F3F4F6' },
];

export default function RecommendationScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredServices = servicesList.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#171717" />
        </Pressable>
        <Text style={styles.headerTitle}>Ask for Recommendation</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          What <Text style={styles.highlight}>services</Text> are you looking for?
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find a service"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <Pressable style={styles.card}>
              <View style={[styles.circle, { backgroundColor: item.color }]}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.cardName}>{item.name}</Text>
            </Pressable>
          )}
        />
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
    paddingBottom: 10,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#171717',
    marginTop: 20,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  highlight: {
    color: '#F47D5B',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginTop: 24,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#171717',
    height: '100%',
  },
  gridContent: {
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '30%',
    alignItems: 'center',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 32,
  },
  cardName: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '500',
  },
});

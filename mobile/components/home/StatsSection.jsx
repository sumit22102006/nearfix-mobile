import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const stats = [
  { id: '1', value: '10K+', label: 'Happy Customers' },
  { id: '2', value: '2K+', label: 'Verified Professionals' },
  { id: '3', value: '50+', label: 'Service Categories' },
  { id: '4', value: '4.8/5', label: 'Average Rating' },
];

export const StatsSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {stats.map((stat) => (
          <View key={stat.id} style={styles.statBox}>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#171717',
    borderRadius: 24,
    padding: 20,
    justifyContent: 'space-between',
    gap: 20,
  },
  statBox: {
    width: '45%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  value: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F47D5B',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#D1D5DB',
    textAlign: 'center',
  },
});

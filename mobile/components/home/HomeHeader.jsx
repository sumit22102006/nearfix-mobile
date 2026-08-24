import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const HomeHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          Near<Text style={styles.logoAccent}>Fix</Text>
        </Text>
      </View>
      
      <View style={styles.rightNav}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="#171717" />
        </Pressable>
        <Pressable style={styles.profileButton}>
          <Ionicons name="person-outline" size={20} color="#171717" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FFF9F7',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#171717',
    letterSpacing: -0.5,
  },
  logoAccent: {
    color: '#F47D5B',
  },
  rightNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1E5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

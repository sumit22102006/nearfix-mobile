import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.centerContent}>
          <Ionicons name="person-circle-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyText}>You are not logged in</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/login')}>
            <Text style={styles.primaryButtonText}>Login / Register</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isProvider = user.roles && user.roles.includes('provider');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{isProvider ? 'Professional' : 'Customer'}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {isProvider ? (
          <Pressable style={styles.menuItem} onPress={() => router.push('/provider/dashboard')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="briefcase-outline" size={24} color="#4F46E5" />
              <Text style={styles.menuItemText}>Professional Dashboard</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        ) : (
          <Pressable style={styles.menuItem} onPress={() => router.push('/provider/onboarding')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="construct-outline" size={24} color="#F59E0B" />
              <Text style={styles.menuItemText}>Become a Professional</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        )}

        <Pressable style={styles.menuItem} onPress={() => router.push('/booking/my-bookings')}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="calendar-outline" size={24} color="#10B981" />
            <Text style={styles.menuItemText}>My Bookings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Log Out</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#F47D5B',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  userInfo: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F47D5B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  menu: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 12,
  },
});

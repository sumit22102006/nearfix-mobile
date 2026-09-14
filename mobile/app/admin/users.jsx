import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import API_URL from '../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminUsersScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        return;
      }

      if (response.ok && data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#171717" />
        </Pressable>
        <Text style={styles.headerTitle}>All Users ({users.length})</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" />
        ) : (
          users.map((user) => (
            <View key={user._id} style={styles.userCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name?.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userPhone}>{user.phone || "No phone provided"}</Text>
              </View>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user.roles.includes('admin') ? 'ADMIN' : 'USER'}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#171717' },
  content: { padding: 20 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#2563EB' },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  userEmail: { fontSize: 13, color: '#4B5563', marginTop: 2 },
  userPhone: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  roleBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  roleText: { fontSize: 10, fontWeight: '700', color: '#4B5563' }
});

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const HomeFooter = () => {
  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <Text style={styles.logoText}>
          Near<Text style={styles.logoAccent}>Fix</Text>
        </Text>
        <Text style={styles.brandDesc}>
          Your trusted platform for local home services.
        </Text>
        <View style={styles.socialRow}>
          <Pressable style={styles.socialIcon}>
            <Ionicons name="logo-instagram" size={20} color="#171717" />
          </Pressable>
          <Pressable style={styles.socialIcon}>
            <Ionicons name="logo-linkedin" size={20} color="#171717" />
          </Pressable>
          <Pressable style={styles.socialIcon}>
            <Ionicons name="logo-facebook" size={20} color="#171717" />
          </Pressable>
        </View>
      </View>

      <View style={styles.linksGrid}>
        <View style={styles.linkColumn}>
          <Text style={styles.columnTitle}>Company</Text>
          <Text style={styles.link}>About</Text>
          <Text style={styles.link}>Contact</Text>
          <Text style={styles.link}>Careers</Text>
        </View>
        <View style={styles.linkColumn}>
          <Text style={styles.columnTitle}>Services</Text>
          <Text style={styles.link}>Electrician</Text>
          <Text style={styles.link}>Plumbing</Text>
          <Text style={styles.link}>Cleaning</Text>
          <Text style={styles.link}>AC Repair</Text>
        </View>
        <View style={styles.linkColumn}>
          <Text style={styles.columnTitle}>Support</Text>
          <Text style={styles.link}>Help Center</Text>
          <Text style={styles.link}>FAQs</Text>
          <Text style={styles.link}>Terms</Text>
          <Text style={styles.link}>Privacy</Text>
        </View>
      </View>

      <View style={styles.divider} />
      
      <Text style={styles.copyright}>
        © 2026 NearFix. All rights reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#F1E5E1',
  },
  brandSection: {
    marginBottom: 30,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#171717',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  logoAccent: {
    color: '#F47D5B',
  },
  brandDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 24,
  },
  linkColumn: {
    width: '45%',
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#171717',
    marginBottom: 16,
  },
  link: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 24,
  },
  copyright: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

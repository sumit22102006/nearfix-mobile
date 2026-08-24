import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export const CTASection = ({ onFindService }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headline}>Need a Service?</Text>
        <Text style={styles.headlineHighlight}>We've Got You Covered.</Text>
        
        <Text style={styles.description}>
          Find trusted professionals near you and book your service today.
        </Text>
        
        <View style={styles.buttonGroup}>
          <Pressable 
            style={({pressed}) => [styles.primaryBtn, pressed && {opacity: 0.9}]}
            onPress={onFindService}
          >
            <Text style={styles.primaryBtnText}>Find a Service</Text>
          </Pressable>
          
          <Pressable style={({pressed}) => [styles.secondaryBtn, pressed && {opacity: 0.8}]}>
            <Text style={styles.secondaryBtnText}>Become a Professional</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#F47D5B',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#F47D5B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  headline: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headlineHighlight: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFD166',
    textAlign: 'center',
    marginTop: 4,
  },
  description: {
    fontSize: 16,
    color: '#FFF0E6',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#171717',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

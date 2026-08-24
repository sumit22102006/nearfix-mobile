import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const steps = [
  {
    number: '01',
    title: 'Search',
    description: 'Find the service you need.',
  },
  {
    number: '02',
    title: 'Choose',
    description: 'Compare nearby professionals, ratings, prices and availability.',
  },
  {
    number: '03',
    title: 'Book',
    description: 'Select a convenient time and confirm your booking.',
  },
];

export const HowItWorksSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>How NearFix Works</Text>
      
      <View style={styles.timeline}>
        {steps.map((step, index) => (
          <View key={step.number} style={styles.stepContainer}>
            <View style={styles.indicatorContainer}>
              <View style={styles.circle}>
                <Text style={styles.number}>{step.number}</Text>
              </View>
              {index < steps.length - 1 && <View style={styles.line} />}
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.description}>{step.description}</Text>
            </View>
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#171717',
    marginBottom: 30,
    textAlign: 'center',
  },
  timeline: {
    paddingHorizontal: 10,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  indicatorContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF9F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F47D5B',
    zIndex: 2,
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F47D5B',
  },
  line: {
    width: 2,
    height: 50,
    backgroundColor: '#F1E5E1',
    marginTop: -4,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#171717',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

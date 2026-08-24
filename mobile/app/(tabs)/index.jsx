import {
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

// Import all the new home components
import { HomeHeader } from "../../components/home/HomeHeader";
import { HeroSection } from "../../components/home/HeroSection";
import { CategoriesSection } from "../../components/home/CategoriesSection";
import { WhyChooseUsSection } from "../../components/home/WhyChooseUsSection";
import { HowItWorksSection } from "../../components/home/HowItWorksSection";
import { PopularServicesSection } from "../../components/home/PopularServicesSection";
import { StatsSection } from "../../components/home/StatsSection";
import { TestimonialsSection } from "../../components/home/TestimonialsSection";
import { CTASection } from "../../components/home/CTASection";
import { HomeFooter } from "../../components/home/HomeFooter";

const HomeScreen = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow location access."
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;

      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        const place = address[0];

        const formattedAddress = [
          place.name,
          place.street,
          place.city,
          place.region,
        ]
          .filter(Boolean)
          .join(", ");

        setLocation(formattedAddress);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Location Error",
        "Could not get your location."
      );
    }
  };

  const handleSearch = () => {
    if (!service) {
      Alert.alert("Enter a Service", "Please enter what service you need.");
      return;
    }
    // TODO: Navigate to Explore screen with params
    Alert.alert("Searching...", `Searching for ${service} near ${location || 'your location'}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <HomeHeader />
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HeroSection 
            service={service}
            setService={setService}
            location={location}
            setLocation={setLocation}
            onGetCurrentLocation={getCurrentLocation}
            onSearch={handleSearch}
          />
          
          <CategoriesSection 
            onViewAll={() => console.log('View all categories')}
            onCategoryPress={(cat) => console.log('Category pressed:', cat)}
          />
          
          <WhyChooseUsSection />
          
          <HowItWorksSection />
          
          <PopularServicesSection 
            onExploreAll={() => console.log('Explore all services')}
            onBookNow={(serviceName) => console.log('Book:', serviceName)}
          />
          
          <StatsSection />
          
          <TestimonialsSection />
          
          <CTASection onFindService={() => router.push('/recommendation')} />
          
          <HomeFooter />
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F7", // NearFix suggested background
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 20 : 40,
  },
});
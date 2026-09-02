import {
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

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


// Put your NEW/rotated Google API key here locally.
// Do NOT paste it into GitHub or send it in chat.
const GOOGLE_API_KEY = "YOUR_NEW_GOOGLE_API_KEY";

const HomeScreen = () => {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [service, setService] = useState("");

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [suggestions, setSuggestions] = useState([]);

  // =====================================================
  // CURRENT LOCATION BUTTON
  // =====================================================

  const getCurrentLocation = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow location access."
        );
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const { latitude, longitude } =
        currentLocation.coords;

      setLatitude(latitude);
      setLongitude(longitude);

      const address =
        await Location.reverseGeocodeAsync({
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

      setSuggestions([]);

    } catch (error) {
      console.log(error);

      Alert.alert(
        "Location Error",
        "Could not get your location."
      );
    }
  };

  // =====================================================
  // LOCATION SEARCH WHILE TYPING
  // =====================================================

  const searchLocation = async (text) => {
    setLocation(text);

    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        "https://places.googleapis.com/v1/places:autocomplete",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_API_KEY,

            "X-Goog-FieldMask":
              "suggestions.placePrediction.placeId," +
              "suggestions.placePrediction.text," +
              "suggestions.placePrediction.structuredFormat",
          },

          body: JSON.stringify({
            input: text,
            includedRegionCodes: ["in"],
            languageCode: "en",
          }),
        }
      );

      const data = await response.json();

      console.log("Location suggestions:", data);

      if (data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
      }

    } catch (error) {
      console.log("Location search error:", error);
      setSuggestions([]);
    }
  };

  // =====================================================
  // SELECT LOCATION SUGGESTION
  // =====================================================

  const selectLocation = async (item) => {
    try {
      const prediction = item.placePrediction;

      if (!prediction) {
        return;
      }

      const placeId = prediction.placeId;

      setLocation(prediction.text.text);
      setSuggestions([]);

      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: "GET",

          headers: {
            "X-Goog-Api-Key": GOOGLE_API_KEY,

            "X-Goog-FieldMask":
              "id,displayName,formattedAddress,location",
          },
        }
      );

      const data = await response.json();

      console.log("Selected location:", data);

      if (data.location) {
        const lat = data.location.latitude;
        const lng = data.location.longitude;

        setLatitude(lat);
        setLongitude(lng);

        if (data.formattedAddress) {
          setLocation(data.formattedAddress);
        }
      }

    } catch (error) {
      console.log(
        "Select location error:",
        error
      );
    }
  };

  // =====================================================
  // SEARCH SERVICE BUTTON
  // =====================================================

  const handleSearchService = () => {
    if (!service.trim()) {
      Alert.alert(
        "Enter a Service",
        "Please enter what service you need."
      );
      return;
    }

    if (!location.trim()) {
      Alert.alert(
        "Enter Location",
        "Please enter your location."
      );
      return;
    }

    console.log("SERVICE:", service);
    console.log("LOCATION:", location);
    console.log("LATITUDE:", latitude);
    console.log("LONGITUDE:", longitude);

    Alert.alert(
      "Searching...",
      `Finding ${service} near ${location}`
    );

    /*
      Later:

      router.push({
        pathname: "/recommendation",
        params: {
          service,
          location,
          latitude,
          longitude,
        },
      });
    */
  };

  // =====================================================
  // LOCATION BUTTON
  // =====================================================

  const handleLocationButton = () => {
    getCurrentLocation();
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        style={{ flex: 1 }}
      >
        <HomeHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >

          <HeroSection
            service={service}
            setService={setService}

            location={location}
            setLocation={searchLocation}

            suggestions={suggestions}
            onSelectLocation={selectLocation}

            onGetCurrentLocation={
              handleLocationButton
            }

            onSearch={
              handleSearchService
            }

            latitude={latitude}
            longitude={longitude}
          />

          <CategoriesSection
            onViewAll={() => {
              console.log("View all categories");
            }}
            onCategoryPress={(category) => {
              console.log("Category pressed:", category);
              router.push("/recommendation");
            }}
          />

          <WhyChooseUsSection />

          <HowItWorksSection />

          <PopularServicesSection
            onExploreAll={() =>
              console.log(
                "Explore all services"
              )
            }
            onBookNow={(serviceName) =>
              console.log(
                "Book:",
                serviceName
              )
            }
          />

          <StatsSection />

          <TestimonialsSection />

          <CTASection
            onFindService={() =>
              router.push("/recommendation")
            }
          />

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
    backgroundColor: "#FFF9F7",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom:
      Platform.OS === "ios" ? 20 : 40,
  },
});
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

// Use environment variable for Google API Key
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "";

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
      const { status } = await Location.requestForegroundPermissionsAsync();

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




// import {
//   StyleSheet,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import React, { useState } from "react";
// import * as Location from "expo-location";
// import { useRouter } from "expo-router";

// import { HomeHeader } from "../../components/home/HomeHeader";
// import { HeroSection } from "../../components/home/HeroSection";
// import { CategoriesSection } from "../../components/home/CategoriesSection";
// import { WhyChooseUsSection } from "../../components/home/WhyChooseUsSection";
// import { HowItWorksSection } from "../../components/home/HowItWorksSection";
// import { PopularServicesSection } from "../../components/home/PopularServicesSection";
// import { StatsSection } from "../../components/home/StatsSection";
// import { TestimonialsSection } from "../../components/home/TestimonialsSection";
// import { CTASection } from "../../components/home/CTASection";
// import { HomeFooter } from "../../components/home/HomeFooter";

// const HomeScreen = () => {
//   const router = useRouter();

//   const [location, setLocation] = useState("");
//   const [service, setService] = useState("");

//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);

//   const [suggestions, setSuggestions] = useState([]);

//   // =====================================================
//   // CURRENT LOCATION
//   // =====================================================

//   const getCurrentLocation = async () => {
//     try {
//       const { status } =
//         await Location.requestForegroundPermissionsAsync();

//       if (status !== "granted") {
//         Alert.alert(
//           "Permission Required",
//           "Please allow location access."
//         );
//         return;
//       }

//       const currentLocation =
//         await Location.getCurrentPositionAsync({
//           accuracy: Location.Accuracy.High,
//         });

//       const { latitude, longitude } =
//         currentLocation.coords;

//       setLatitude(latitude);
//       setLongitude(longitude);

//       // Reverse geocoding using Expo Location
//       const address =
//         await Location.reverseGeocodeAsync({
//           latitude,
//           longitude,
//         });

//       if (address.length > 0) {
//         const place = address[0];

//         const formattedAddress = [
//           place.name,
//           place.street,
//           place.city,
//           place.region,
//           place.country,
//         ]
//           .filter(Boolean)
//           .join(", ");

//         setLocation(formattedAddress);
//       }

//       setSuggestions([]);

//       console.log("Current Location:");
//       console.log("Latitude:", latitude);
//       console.log("Longitude:", longitude);
//     } catch (error) {
//       console.log("Current location error:", error);

//       Alert.alert(
//         "Location Error",
//         "Could not get your location."
//       );
//     }
//   };

//   // =====================================================
//   // NOMINATIM LOCATION SEARCH
//   // =====================================================

//   const searchLocation = async (text) => {
//     setLocation(text);
//   };

//   // =====================================================
//   // SEARCH LOCATION BUTTON
//   // =====================================================

//   const handleLocationSearch = async () => {
//     if (!location.trim()) {
//       Alert.alert(
//         "Enter Location",
//         "Please enter a location."
//       );
//       return;
//     }

//     if (location.trim().length < 3) {
//       Alert.alert(
//         "Invalid Location",
//         "Please enter at least 3 characters."
//       );
//       return;
//     }

//     try {
//       const url =
//         "https://nominatim.openstreetmap.org/search" +
//         `?q=${encodeURIComponent(location.trim())}` +
//         "&format=jsonv2" +
//         "&limit=5" +
//         "&countrycodes=in" +
//         "&addressdetails=1";

//       console.log("Nominatim URL:", url);

//       const response = await fetch(url, {
//         headers: {
//           Accept: "application/json",
//           "User-Agent": "NearFixApp/1.0",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Nominatim request failed: ${response.status}`
//         );
//       }

//       const data = await response.json();

//       console.log("Nominatim Results:", data);

//       if (data.length === 0) {
//         setSuggestions([]);

//         Alert.alert(
//           "Location Not Found",
//           "Could not find this location."
//         );

//         return;
//       }

//       setSuggestions(data);

//     } catch (error) {
//       console.log(
//         "Nominatim search error:",
//         error
//       );

//       Alert.alert(
//         "Search Error",
//         "Could not search for this location."
//       );

//       setSuggestions([]);
//     }
//   };

//   // =====================================================
//   // SELECT LOCATION
//   // =====================================================

//   const selectLocation = (item) => {
//     try {
//       const lat = parseFloat(item.lat);
//       const lng = parseFloat(item.lon);

//       setLatitude(lat);
//       setLongitude(lng);

//       setLocation(item.display_name);

//       setSuggestions([]);

//       console.log("Selected Location:");
//       console.log("Address:", item.display_name);
//       console.log("Latitude:", lat);
//       console.log("Longitude:", lng);

//     } catch (error) {
//       console.log(
//         "Select location error:",
//         error
//       );
//     }
//   };

//   // =====================================================
//   // SEARCH SERVICE
//   // =====================================================

//   const handleSearchService = () => {
//     if (!service.trim()) {
//       Alert.alert(
//         "Enter a Service",
//         "Please enter what service you need."
//       );
//       return;
//     }

//     if (!location.trim()) {
//       Alert.alert(
//         "Enter Location",
//         "Please enter your location."
//       );
//       return;
//     }

//     if (
//       latitude === null ||
//       longitude === null
//     ) {
//       Alert.alert(
//         "Select Location",
//         "Please search and select a location first."
//       );
//       return;
//     }

//     console.log("SERVICE:", service);
//     console.log("LOCATION:", location);
//     console.log("LATITUDE:", latitude);
//     console.log("LONGITUDE:", longitude);

//     Alert.alert(
//       "Searching...",
//       `Finding ${service} near ${location}`
//     );

//     /*
//     Later:

//     router.push({
//       pathname: "/recommendation",
//       params: {
//         service,
//         location,
//         latitude: latitude.toString(),
//         longitude: longitude.toString(),
//       },
//     });
//     */
//   };

//   // =====================================================
//   // LOCATION BUTTON
//   // =====================================================

//   const handleLocationButton = () => {
//     getCurrentLocation();
//   };

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <SafeAreaView
//       style={styles.container}
//       edges={["top", "left", "right"]}
//     >
//       <KeyboardAvoidingView
//         behavior={
//           Platform.OS === "ios"
//             ? "padding"
//             : "height"
//         }
//         style={{ flex: 1 }}
//       >
//         <HomeHeader />

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={
//             styles.scrollContent
//           }
//           keyboardShouldPersistTaps="handled"
//         >
//           <HeroSection
//             service={service}
//             setService={setService}

//             location={location}
//             setLocation={searchLocation}

//             suggestions={suggestions}
//             onSelectLocation={selectLocation}

//             onGetCurrentLocation={
//               handleLocationButton
//             }

//             onSearchLocation={
//               handleLocationSearch
//             }

//             onSearch={
//               handleSearchService
//             }

//             latitude={latitude}
//             longitude={longitude}
//           />

//           <CategoriesSection
//             onViewAll={() => {
//               console.log(
//                 "View all categories"
//               );
//             }}
//             onCategoryPress={(category) => {
//               console.log(
//                 "Category pressed:",
//                 category
//               );

//               router.push("/recommendation");
//             }}
//           />

//           <WhyChooseUsSection />

//           <HowItWorksSection />

//           <PopularServicesSection
//             onExploreAll={() =>
//               console.log(
//                 "Explore all services"
//               )
//             }
//             onBookNow={(serviceName) =>
//               console.log(
//                 "Book:",
//                 serviceName
//               )
//             }
//           />

//           <StatsSection />

//           <TestimonialsSection />

//           <CTASection
//             onFindService={() =>
//               router.push("/recommendation")
//             }
//           />

//           <HomeFooter />
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF9F7",
//   },

//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom:
//       Platform.OS === "ios"
//         ? 20
//         : 40,
//   },
// });


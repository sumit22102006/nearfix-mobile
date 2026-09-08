import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import AsyncStorage from
  "@react-native-async-storage/async-storage";


export default function AdminDashboard() {

  const router = useRouter();


  const logout = async () => {

    await AsyncStorage.removeItem(
      "adminToken"
    );

    await AsyncStorage.removeItem(
      "adminUser"
    );

    router.replace(
      "/admin/login"
    );
  };


  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        NearFix Admin Dashboard
      </Text>


      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          Users
        </Text>

        <Text style={styles.value}>
          0
        </Text>

      </View>


      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          Professionals
        </Text>

        <Text style={styles.value}>
          0
        </Text>

      </View>


      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          Bookings
        </Text>

        <Text style={styles.value}>
          0
        </Text>

      </View>


      <TouchableOpacity
        style={styles.logout}
        onPress={logout}
      >

        <Text style={styles.logoutText}>
          Logout
        </Text>

      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFF9F7",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 16,
    color: "gray",
  },

  value: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 5,
  },

  logout: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
  },

});
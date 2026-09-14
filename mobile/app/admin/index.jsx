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

    router.replace("/admin/login");
  };


  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        🔐 NEARFIX ADMIN
      </Text>

      <Text style={styles.subtitle}>
        ADMIN DASHBOARD
      </Text>

      <Text style={styles.message}>
        You are logged in as Admin
      </Text>


      <TouchableOpacity
        style={styles.button}
        onPress={logout}
      >
        <Text style={styles.buttonText}>
          Logout
        </Text>
      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9F7",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  message: {
    fontSize: 16,
    marginTop: 20,
  },

  button: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 30,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

});
import React, {
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import API_URL from "../../api/config";


export default function AdminLogin() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleLogin = async () => {

    if (!email || !password) {

      Alert.alert(
        "Required",
        "Enter email and password"
      );

      return;
    }


    try {

      setLoading(true);


      const response =
        await fetch(
          `${API_URL}/api/admin/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        Alert.alert(
          "Login Failed",
          data.message
        );

        return;
      }


      // Save admin token
      await AsyncStorage.setItem(
        "adminToken",
        data.token
      );


      // Save admin user
      await AsyncStorage.setItem(
        "adminUser",
        JSON.stringify(data.user)
      );


      router.replace("/admin");

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Unable to connect to server"
      );

    } finally {

      setLoading(false);
    }
  };


  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        NearFix Admin
      </Text>

      <Text style={styles.subtitle}>
        Admin Login
      </Text>


      <TextInput
        style={styles.input}
        placeholder="Admin Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />


      <TextInput
        style={styles.input}
        placeholder="Admin Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />


      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >

        {loading ? (

          <ActivityIndicator
            color="white"
          />

        ) : (

          <Text style={styles.buttonText}>
            Login as Admin
          </Text>

        )}

      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#FFF9F7",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: 30,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "white",
  },

  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

});
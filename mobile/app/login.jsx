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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import {
  useAuth,
} from "../context/AuthContext";


const Login = () => {

  const router = useRouter();

  const {
    login,
  } = useAuth();


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ========================================
  // HANDLE LOGIN
  // ========================================

  const handleLogin = async () => {

    if (!email.trim()) {

      Alert.alert(
        "Email Required",
        "Please enter your email."
      );

      return;
    }


    if (!password.trim()) {

      Alert.alert(
        "Password Required",
        "Please enter your password."
      );

      return;
    }


    try {

      setLoading(true);


      const result =
        await login(
          email.trim(),
          password
        );


      if (!result.success) {

        Alert.alert(
          "Login Failed",
          result.message
        );

        return;
      }


      // Login successful
      router.replace("/(tabs)");

    } catch (error) {

      Alert.alert(
        "Error",
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <View style={styles.content}>

        <Text style={styles.logo}>
          NearFix
        </Text>


        <Text style={styles.title}>
          Welcome Back
        </Text>


        <Text style={styles.subtitle}>
          Login to continue
        </Text>


        {/* EMAIL */}

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />


        {/* PASSWORD */}

        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />


        {/* LOGIN BUTTON */}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >

          {loading ? (

            <ActivityIndicator
              color="#fff"
            />

          ) : (

            <Text style={styles.buttonText}>
              Login
            </Text>

          )}

        </TouchableOpacity>


        {/* REGISTER */}

        <View style={styles.registerContainer}>

          <Text style={styles.normalText}>
            Don't have an account?
          </Text>


          <TouchableOpacity
            onPress={() =>
              router.push("/register")
            }
          >

            <Text style={styles.registerText}>
              Register
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </KeyboardAvoidingView>
  );
};


export default Login;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFF9F7",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
  },

  logo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "gray",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 7,
    marginTop: 15,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  loginButton: {
    height: 52,
    backgroundColor: "#000",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    gap: 5,
  },

  normalText: {
    color: "gray",
  },

  registerText: {
    fontWeight: "bold",
  },

});
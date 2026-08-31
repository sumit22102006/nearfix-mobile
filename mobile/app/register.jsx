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
  ScrollView,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import {
  useAuth,
} from "../context/AuthContext";


const Register = () => {

  const router = useRouter();

  const {
    register,
  } = useAuth();


  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ========================================
  // REGISTER
  // ========================================

  const handleRegister = async () => {

    if (!name.trim()) {

      Alert.alert(
        "Name Required",
        "Please enter your name."
      );

      return;
    }


    if (!email.trim()) {

      Alert.alert(
        "Email Required",
        "Please enter your email."
      );

      return;
    }


    if (!phone.trim()) {

      Alert.alert(
        "Phone Required",
        "Please enter your phone number."
      );

      return;
    }


    if (!password) {

      Alert.alert(
        "Password Required",
        "Please enter a password."
      );

      return;
    }


    if (password.length < 6) {

      Alert.alert(
        "Weak Password",
        "Password must contain at least 6 characters."
      );

      return;
    }


    if (
      password !== confirmPassword
    ) {

      Alert.alert(
        "Password Mismatch",
        "Passwords do not match."
      );

      return;
    }


    try {

      setLoading(true);


      const result =
        await register(
          name.trim(),
          email.trim(),
          phone.trim(),
          password,
          "user"
        );


      if (!result.success) {

        Alert.alert(
          "Registration Failed",
          result.message
        );

        return;
      }


      Alert.alert(
        "Success",
        "Your account has been created.",
        [
          {
            text: "Continue",
            onPress: () =>
              router.replace(
                "/(tabs)"
              ),
          },
        ]
      );

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

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
      >

        <Text style={styles.logo}>
          NearFix
        </Text>


        <Text style={styles.title}>
          Create Account
        </Text>


        <Text style={styles.subtitle}>
          Join NearFix today
        </Text>


        {/* NAME */}

        <Text style={styles.label}>
          Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />


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


        {/* PHONE */}

        <Text style={styles.label}>
          Phone
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />


        {/* PASSWORD */}

        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />


        {/* CONFIRM PASSWORD */}

        <Text style={styles.label}>
          Confirm Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={
            setConfirmPassword
          }
          secureTextEntry
        />


        {/* REGISTER BUTTON */}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >

          {loading ? (

            <ActivityIndicator
              color="#fff"
            />

          ) : (

            <Text style={styles.buttonText}>
              Create Account
            </Text>

          )}

        </TouchableOpacity>


        {/* LOGIN */}

        <View style={styles.loginContainer}>

          <Text style={styles.normalText}>
            Already have an account?
          </Text>


          <TouchableOpacity
            onPress={() =>
              router.push("/login")
            }
          >

            <Text style={styles.loginText}>
              Login
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
};


export default Register;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFF9F7",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
    paddingTop: 50,
    paddingBottom: 40,
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
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 7,
    marginTop: 12,
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

  registerButton: {
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

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    gap: 5,
  },

  normalText: {
    color: "gray",
  },

  loginText: {
    fontWeight: "bold",
  },

});
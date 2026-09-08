import {
  Stack,
  useRouter,
  useSegments,
} from "expo-router";

import { useEffect } from "react";

import {
  AuthProvider,
  useAuth,
} from "../context/AuthContext";


// ==========================================
// INITIAL LAYOUT
// ==========================================

function InitialLayout() {

  const {
    user,
    loading,
  } = useAuth();

  const segments = useSegments();

  const router = useRouter();


  useEffect(() => {

    // --------------------------------------
    // Wait until authentication is checked
    // --------------------------------------

    if (loading) return;


    // --------------------------------------
    // Normal authentication pages
    // --------------------------------------

    const inAuthGroup =
      segments[0] === "login" ||
      segments[0] === "register";


    // --------------------------------------
    // Admin pages
    // --------------------------------------

    const inAdminGroup =
      segments[0] === "admin";


    // --------------------------------------
    // ADMIN AREA
    // --------------------------------------
    //
    // Don't apply normal user authentication
    // redirects to admin pages.
    //
    // Admin authentication will be handled
    // separately inside /admin.
    //

    if (inAdminGroup) {
      return;
    }


    // --------------------------------------
    // NORMAL USER NOT LOGGED IN
    // --------------------------------------

    if (!user && !inAuthGroup) {

      router.replace("/login");

      return;
    }


    // --------------------------------------
    // NORMAL USER ALREADY LOGGED IN
    // --------------------------------------

    if (user && inAuthGroup) {

      router.replace("/(tabs)");

      return;
    }

  }, [
    user,
    loading,
    segments,
  ]);


  return (

    <Stack>

      {/* ================================ */}
      {/* NORMAL USER APP */}
      {/* ================================ */}

      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />


      {/* ================================ */}
      {/* NORMAL USER LOGIN */}
      {/* ================================ */}

      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />


      {/* ================================ */}
      {/* NORMAL USER REGISTER */}
      {/* ================================ */}

      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />


      {/* ================================ */}
      {/* ADMIN */}
      {/* ================================ */}

      <Stack.Screen
        name="admin"
        options={{
          headerShown: false,
        }}
      />


      {/* ================================ */}
      {/* OTHER SCREENS */}
      {/* ================================ */}

      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
        }}
      />


      <Stack.Screen
        name="recommendation"
        options={{
          headerShown: false,
        }}
      />

    </Stack>
  );
}


// ==========================================
// ROOT LAYOUT
// ==========================================

export default function RootLayout() {

  return (

    <AuthProvider>

      <InitialLayout />

    </AuthProvider>
  );
}
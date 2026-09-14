import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";

function InitialLayout() {
  const { user, loading } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!segments || segments.length === 0) return;

    const firstSegment = segments[0];

    // =========================
    // ADMIN ROUTES
    // =========================
    if (firstSegment === "admin") {
      return;
    }

    // =========================
    // NORMAL USER AUTH
    // =========================
    const inAuthGroup =
      firstSegment === "login" ||
      firstSegment === "register";

    if (!user && !inAuthGroup) {
      router.replace("/login");
      return;
    }

    if (user && inAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [user, loading, segments]);

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />

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

      <Stack.Screen
        name="admin"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";

// 1. Create a component that sits INSIDE the AuthProvider
// so it has access to the user state.
function InitialLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // If the auth context is still loading, do nothing
    if (loading) return;

    // Check if the user is currently on a page that doesn't require auth (like login/register)
    const inAuthGroup = segments[0] === "login" || segments[0] === "register";

    if (!user && !inAuthGroup) {
      // If the user is not logged in and they are trying to access the app, kick them to login
      router.replace("/login");
    } else if (user && inAuthGroup) {
      // If the user IS logged in but they are on the login/register screen, push them to tabs
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="recommendation" options={{ headerShown: false }} />
    </Stack>
  );
}

// 2. Wrap it all in your AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
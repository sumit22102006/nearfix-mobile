import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../../api/config";

export default function AdminLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const adminToken = await AsyncStorage.getItem("adminToken");
        const inAdminLogin = pathname === "/admin/login";

        if (!adminToken) {
          if (!inAdminLogin) {
            router.replace("/admin/login");
          }
          setIsValidating(false);
          return;
        }

        // Validate token with backend
        const response = await fetch(`${API_URL}/api/admin/test`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (!response.ok) {
          // Token invalid or expired
          await AsyncStorage.removeItem("adminToken");
          await AsyncStorage.removeItem("adminUser");
          if (!inAdminLogin) {
            router.replace("/admin/login");
          }
        } else if (inAdminLogin) {
          // Token is valid and trying to access login
          router.replace("/admin");
        }
      } catch (error) {
        console.error("Admin auth check error", error);
      } finally {
        setIsValidating(false);
      }
    };

    checkAdminAuth();
  }, [pathname]);

  if (isValidating) return null;

  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
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
    </Stack>
  );
}
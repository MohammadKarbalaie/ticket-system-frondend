"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getUser,
  fetchUserProfile,
  getValidAccessToken,
  removeTokens,
} from "@/utils/token";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/settings",
    "/tickets/all",
    "/tickets/my",
    "/tickets/new",
    "/tickets/assigned",
    "/tickets/[id]",
    "/users",
  ];

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          removeTokens();
          setUser(null);
          if (protectedRoutes.includes(pathname)) {
            router.push("/");
          }
          setLoading(false);
          return;
        }

        let currentUser = getUser();
        if (!currentUser) {
          currentUser = await fetchUserProfile();
        }
        setUser(currentUser);

        if (pathname === "/") {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("[AuthProvider] Error:", error);
        removeTokens();
        setUser(null);
        if (protectedRoutes.includes(pathname)) {
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [pathname, router]);

  const logout = () => {
    removeTokens();
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

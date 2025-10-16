import { createContext, useContext, useState, useEffect } from "react";
import {
  signup,
  login as loginApi,
  refresh,
  fetchProfile,
  logoutApi,
  setAccessToken as setAxiosToken,
} from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const { accessToken: newToken } = await refresh();
        setAccessToken(newToken);
        setAxiosToken(newToken);
        const userProfile = await fetchProfile();
        setUser(userProfile);
      } catch (err) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  useEffect(() => {
    setAxiosToken(accessToken);
  }, [accessToken]);

  const login = async (email, password) => {
    const { user, accessToken: newToken } = await loginApi({ email, password });
    setUser(user);
    setAccessToken(newToken);
    setAxiosToken(newToken);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      setAccessToken(null);
      setAxiosToken(null);
    }
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!accessToken,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

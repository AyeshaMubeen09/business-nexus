import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole, AuthContextType } from "../types";
import toast from "react-hot-toast";
import { socket } from "../socket/socket";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "business_nexus_user";
const TOKEN_STORAGE_KEY = "business_nexus_token";
const RESET_TOKEN_KEY = "business_nexus_reset_token";

const API_URL = "http://localhost:5000/api/auth";
const USER_API_URL = "http://localhost:5000/api/users";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadUser = async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${USER_API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

const normalizedUser = {
  ...data.user,
  id: data.user._id,
};

setUser(normalizedUser);

localStorage.setItem(
  USER_STORAGE_KEY,
  JSON.stringify(normalizedUser)
);

    } catch (error) {
      console.error(error);

      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  loadUser();
}, []);

/* ==========================================
   SOCKET CONNECTION
========================================== */

useEffect(() => {
  if (!user) return;

  socket.connect();

  console.log("Socket Connected");

  return () => {
    socket.disconnect();

    console.log("Socket Disconnected");
  };
}, [user]);

  // LOGIN
  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/login`, {
        email,
        password,
        role,
      });
      const normalizedUser = {
  ...data.user,
  id: data.user._id,
};

localStorage.setItem(
  USER_STORAGE_KEY,
  JSON.stringify(normalizedUser)
);

      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);

      axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${data.token}`;

setUser(normalizedUser);
      
      toast.success(data.message);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Login failed";

      toast.error(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role,
      });

const normalizedUser = {
  ...data.user,
  id: data.user._id,
};

localStorage.setItem(
  USER_STORAGE_KEY,
  JSON.stringify(normalizedUser)
);

      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);

      axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${data.token}`;

setUser(normalizedUser);

      toast.success(data.message);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Registration failed";

      toast.error(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // FORGOT PASSWORD (temporary)
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      localStorage.setItem(RESET_TOKEN_KEY, "dummy-token");

      toast.success("Password reset feature coming soon");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  // RESET PASSWORD (temporary)
  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<void> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      localStorage.removeItem(RESET_TOKEN_KEY);

      toast.success("Password reset feature coming soon");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  // LOGOUT
const logout = (): void => {
  setUser(null);

  delete axios.defaults.headers.common["Authorization"];

  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);

  toast.success("Logged out successfully");
};

// UPDATE PROFILE
const updateProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<void> => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    const { data } = await axios.put(
      "http://localhost:5000/api/users/profile",
      updates,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

const normalizedUser = {
  ...data.user,
  id: data.user._id,
};

setUser(normalizedUser);

localStorage.setItem(
  USER_STORAGE_KEY,
  JSON.stringify(normalizedUser)
);

    toast.success(data.message);
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to update profile";

    toast.error(message);
    throw new Error(message);
  }
};

const updateEmail = async (
  currentPassword: string,
  newEmail: string
): Promise<void> => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    const { data } = await axios.put(
      `${USER_API_URL}/profile`,
      {
        email: newEmail,
        currentPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

const normalizedUser = {
  ...data.user,
  id: data.user._id,
};

setUser(normalizedUser);

localStorage.setItem(
  USER_STORAGE_KEY,
  JSON.stringify(normalizedUser)
);

    toast.success("Email updated successfully");
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to update email";

    toast.error(message);
    throw new Error(message);
  }
};

const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    const { data } = await axios.put(
      `${USER_API_URL}/profile`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(data.message);
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to update password";

    toast.error(message);
    throw new Error(message);
  }
};

const value = {
  user,
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  updateEmail,
  updatePassword,
  isAuthenticated: !!user,
  isLoading,
};
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
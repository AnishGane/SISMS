import React, { createContext, useContext, useState } from "react";
import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";
// import { useNavigate } from "react-router-dom";

interface FormData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  storeName?: string;
  storeAddress?: string;
}

interface AuthContextType {
  formData: FormData;
  user: any;
  loading: boolean;
  error: string | null;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  resetForm: () => void;

  registerAdmin: (e: React.FormEvent) => Promise<void>;
  loginAdmin: (e: React.FormEvent) => Promise<void>;
  staffLogin: (e: React.FormEvent) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

  // ✔ Update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset after submit success
  const resetForm = () => setFormData({});

  // Admin Registration Handler
  const registerAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER_ADMIN,
        formData
      );

    // setUser(res.data.admin);
    console.log(res.data.message);
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Admin Login Handler
  const loginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN_ADMIN,
        formData
      );

      const {token, admin} = res.data;
      if(token) {
        localStorage.setItem('token', token);
        // localStorage.setItem('admin', JSON.stringify(admin));
        localStorage.setItem('username', admin.name);
      }

      if(admin){
          setUser(admin);
      }
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

//   Staff Login handler
const staffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN_STAFF, formData);

        const {token, staff} = res.data;
        if(token){
            localStorage.setItem('token', token);
            // localStorage.setItem('staff', JSON.stringify(staff));
            localStorage.setItem('staff_username', staff.name);
        }
        if(staff){
            setUser(staff);
        }
        resetForm();
        // navigate('/admin/register');
    } catch (error: any) {
        setError(error.response?.data?.message || "Login failed");
    } finally {
        setLoading(false);
    }
}

  return (
    <AuthContext.Provider
      value={{
        formData,
        user,
        loading,
        error,
        handleChange,
        resetForm,
        registerAdmin,
        loginAdmin,
        staffLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

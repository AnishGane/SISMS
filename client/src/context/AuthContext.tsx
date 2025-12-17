import React, { createContext, useContext, useState } from 'react';
import { API_PATHS } from '../utils/apiPath';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface FormData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  storeName?: string;
  storeAddress?: string;
  avatar?: string | File | null;
}

interface AuthContextType {
  formData: FormData;
  user: any;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  error: string | null;
  forgotPasswordLink: boolean;
  navigate: any;
  location: any;

  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  resetForm: () => void;

  registerAdmin: (e: React.FormEvent) => Promise<void>;
  loginAdmin: (e: React.FormEvent) => Promise<void>;
  staffLogin: (e: React.FormEvent) => Promise<void>;
  // for showing forgot password link
  getLoginfromURL: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordLink, setForgotPasswordLink] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getLoginfromURL = () => {
    const loginURL = window.location.pathname;
    if (loginURL.includes('login')) {
      setForgotPasswordLink(true);
    } else {
      setForgotPasswordLink(false);
    }
  };

  // Update form data
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

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fd.append(key, value);
        }
      });

      await axiosInstance.post(API_PATHS.AUTH.REGISTER_ADMIN, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      resetForm();
      toast.success('Registration successful');
    } catch (err: any) {
      toast.error(err.response?.data?.message);
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
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN_ADMIN, formData);

      const { token, admin } = res.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(admin));
        toast.success('Login successful');
      }

      if (admin) {
        setUser(admin);
      }
      navigate('/admin/dashboard');
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message);
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

      const { token, staff } = res.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(staff));
        toast.success('Login successful');
      }
      if (staff) {
        setUser(staff);
      }
      resetForm();
      // navigate('/admin/register');
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        formData,
        setFormData,
        user,
        loading,
        setLoading,
        setError,
        error,
        forgotPasswordLink,
        navigate,
        location,
        handleChange,
        resetForm,
        registerAdmin,
        loginAdmin,
        staffLogin,
        getLoginfromURL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

const StaffLogin = () => {
  const {staffLogin, loading, error,forgotPasswordLink, getLoginfromURL} = useAuth();

  useEffect(() => {
    getLoginfromURL();
  }, []);

  return (
    <AuthLayout>
      <AuthForm
        title="Staff Login"
        subtitle="Log in to manage orders and inventory."
        buttonText={loading? "Please wait..." : "Login"}
        onSubmit={staffLogin}
        fields={[
          {
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "you@example.com",
          },
          {
            label: "Password",
            name: "password",
            type: "password",
            placeholder: "********",
          },
        ]}
        showForgotPassword={forgotPasswordLink}
        forgotPasswordPath="/auth/staff/forgot-password"
        bottomLinks={
          <>
            <p>
              Admin?{" "}
              <Link to={"/auth/admin/login"}
                className="text-blue-500 hover:underline"
              >
                Login here 
              </Link>
            </p>
          </>
        }
      />
      {error && <p className="text-red-500">{error}</p>}
    </AuthLayout>
  );
};

export default StaffLogin;

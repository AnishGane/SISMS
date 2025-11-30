import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const { loginAdmin, loading, error } = useAuth();
  return (
    <AuthLayout>
      <AuthForm
        title="Admin Login"
        subtitle="Enter your credentials to access the dashboard."
        buttonText={loading ? "Please wait..." : "Login"}
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
        onSubmit={loginAdmin}
        bottomLinks={
          <>
            <p>
              Don’t have an account?{" "}
              <Link to={"/auth/admin/register"}
                className="text-blue-500 hover:underline"
              >
                Register
              </Link>
            </p>
            <p className="mt-2">
              Staff login?{" "}
              <Link to={"/auth/staff/login"}
                className="text-blue-500 hover:underline"
              >
                Click here
              </Link>
            </p>
          </>
        }
      />
      {error && <p className="text-red-500">{error}</p>}
    </AuthLayout>
  );
};

export default AdminLogin;

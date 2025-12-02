import { Link } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../layouts/AuthLayout";

const AdminRegister = () => {
  const {registerAdmin, loading, error } = useAuth();

  return (
    <AuthLayout>
      <AuthForm
        title="Admin Registration"
        subtitle="Create an admin account."
        buttonText={loading ? "Please wait..." : "Register"}
        fields={[
          { label: "Name", name: "name", type: "text", placeholder: "John Doe" },
          { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
          { label: "Password", name: "password", type: "password", placeholder: "********" },
          { label: "Phone", name: "phone", type: "tel", placeholder: "98xxxxxxxx" },
        ]}
        storeFields={[
          { label: "Store Name", name: "storeName", type: "text", placeholder: "Store Name" },
          { label: "Store Address", name: "storeAddress", type: "text", placeholder: "Store Address" },
        ]}
        onSubmit={registerAdmin}
        bottomLinks={
            <p>
              Already have an account?{" "}
              <Link to={"/auth/admin/login"}
                className="text-blue-500 hover:underline"
              >
                Login
              </Link>
            </p>
        }
      />

      {error && <p className="text-red-500 text-center mt-3">{error}</p>}
    </AuthLayout>
  );
};

export default AdminRegister;

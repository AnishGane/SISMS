import type { ReactNode } from "react";

interface AuthLayoutProps {
  children?: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left side: form/content */}
      <div className=" relative flex-1 flex">
  {/* Dreamy Sky Pink Glow */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
    }}
  />
        <div className="z-30 px-4 sm:px-10 py-2 flex flex-col justify-between container h-auto mx-auto mt-6 overflow-y-auto">
          {/* Optional small logo/banner */}
          <div className="mb-8 w-16">
            <img
              src="/images/Logo.jpeg"
              alt="Auth Logo"
              loading="lazy"
              title="Smart Inventory & Sales Management System"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="w-full max-w-lg m-auto">{children}</div>

        </div>
      </div>

      {/* Right side: decorative image */}
      <div className=" relative flex-1/3 hidden md:flex">
        <div id="triangle-topleft"></div>
        <div id="triangle-topright"></div>
        <div id="triangle-bottomleft"></div>
        <div id="triangle-bottomright"></div>
        <img
          src="/images/Auth_right_image.jpeg"
          alt="Auth Banner"
          loading="lazy"
          className="w-full h-full object-cover "
        />
      </div>
    </div>
  );
};

export default AuthLayout;

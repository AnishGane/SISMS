import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children?: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left side: form/content */}
      <div className="relative flex flex-1">
        {/* Dreamy Sky Pink Glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
          }}
        />
        <div className="z-30 container mx-auto mt-6 flex h-auto flex-col justify-between overflow-y-auto px-4 py-2 sm:px-10">
          {/* Optional small logo/banner */}
          <div className="mb-8 w-16">
            <img
              src="/images/Logo.jpeg"
              alt="Auth Logo"
              loading="lazy"
              title="Smart Inventory & Sales Management System"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="m-auto w-full max-w-lg">{children}</div>
        </div>
      </div>

      {/* Right side: decorative image */}
      <div className="relative hidden flex-1/3 md:flex">
        <div id="triangle-topleft"></div>
        <div id="triangle-topright"></div>
        <div id="triangle-bottomleft"></div>
        <div id="triangle-bottomright"></div>
        <img
          src="/images/Auth_right_image.jpeg"
          alt="Auth Banner"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

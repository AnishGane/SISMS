import React from 'react';
// import heroImg from '../assets/hero.png'; // replace with your actual image path
import feature1 from '/images/feature1.jpg';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-base-100 text-base-content min-h-screen w-full">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-between gap-10 px-10 py-20 md:flex-row">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl leading-tight font-bold">
            Smart Inventory & Sales Management System
          </h1>
          <p className="max-w-xl text-lg opacity-80">
            Manage stock, sales, staff, and operations effortlessly with our modern SISMS platform
            designed for businesses that want speed, accuracy, and automation.
          </p>
          <button className="btn btn-primary btn-lg w-fit">Get Started</button>
        </div>
        <div className="flex-1">
          <img src={feature1} alt="SISMS Hero" className="w-full" />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-base-200 px-10 py-20">
        <h2 className="mb-12 text-center text-4xl font-semibold">
          Powerful Features to Boost Your Workflow
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="card bg-base-100 p-5 text-center shadow-xl">
            <img src={feature1} alt="Inventory" className="mx-auto w-24" />
            <h3 className="mt-4 text-2xl font-semibold">Inventory Tracking</h3>
            <p className="mt-2 opacity-80">
              Keep real-time track of stock levels, categories, and product details.
            </p>
          </div>

          <div className="card bg-base-100 p-5 text-center shadow-xl">
            <img src={feature1} alt="Sales" className="mx-auto w-24" />
            <h3 className="mt-4 text-2xl font-semibold">Sales Monitoring</h3>
            <p className="mt-2 opacity-80">
              View and manage sales records, order details, and staff performance.
            </p>
          </div>

          <div className="card bg-base-100 p-5 text-center shadow-xl">
            <img src={feature1} alt="Staff" className="mx-auto w-24" />
            <h3 className="mt-4 text-2xl font-semibold">Staff Management</h3>
            <p className="mt-2 opacity-80">
              Add, manage, and assign roles to staff members efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-content px-10 py-20 text-center">
        <h2 className="mb-4 text-4xl font-bold">Ready to streamline your business?</h2>
        <p className="mb-6 text-lg opacity-90">
          Start using SISMS today and take your store management to the next level.
        </p>
        <button className="btn btn-secondary btn-lg">Create Account</button>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 text-base-content mt-20 px-10 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-xl font-bold">SISMS</h3>
            <p className="max-w-sm opacity-75">
              A modern system built to help businesses manage inventory, sales, and staff with ease.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2 opacity-80">
              <li>Home</li>
              <li>Features</li>
              <li>Pricing</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-bold">Contact</h3>
            <p className="opacity-80">Email: support@sisms.com</p>
            <p className="opacity-80">Phone: +977-9800000000</p>
          </div>
        </div>

        <p className="mt-10 text-center opacity-70">
          © {new Date().getFullYear()} SISMS. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;

import React from 'react';
import ReviewSection from '../../components/LandingPage/ReviewSection';
import Faqs from '../../components/LandingPage/Faqs';
import Banner from '../../components/LandingPage/Banner';
import Features from '../../components/LandingPage/Features';
import Badge from '../../components/LandingPage/Badge';
import Hero from '../../components/LandingPage/Hero';
import Footer from '../../components/LandingPage/Footer';
import LandingNav from '../../components/LandingPage/LandingNav';
import Title from '../../components/Title';

const LandingPage: React.FC = () => {
  return (
    <main className="mx-auto w-full max-w-380 py-4">
      <Title title="Smart Inventory & Sales Management System" />
      {/* Navbar */}
      <LandingNav />

      <section className="mt-20 text-center">
        {/* Badge */}
        <Badge />

        <Hero />

        {/* Feature Section */}
        <Features />

        {/* FAQ Section */}
        <Faqs />

        {/* Banner Section */}
        <Banner />

        {/* Review Section */}
        <ReviewSection />

        <Footer />
      </section>
    </main>
  );
};

export default LandingPage;

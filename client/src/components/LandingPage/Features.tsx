import { Layers, Lock, MessageCircleMore, TrendingUp, Users } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="mt-24 space-y-4 border-t border-neutral-300 py-14">
      <p className="text-lg font-semibold text-[#6941C6]">Features</p>
      <h1 className="text-4xl font-semibold">Beautiful analytics to grow smarter</h1>
      <p className="mx-auto max-w-2xl text-lg text-neutral-500">
        Powerful, self-serve product and growth analytics to help you convert, engage, and retain
        more users. Trusted by over 4,000 startups.
      </p>

      {/* Bento Grid */}
      <div className="mx-auto grid max-w-360 grid-cols-1 gap-6 p-10 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring ring-neutral-400/50 hover:ring-neutral-400">
          <MessageCircleMore className="h-10 w-10 text-purple-600" />
          <h3 className="mt-4 text-xl font-semibold">Smart Analytics</h3>
          <p className="mt-2 text-gray-600">
            Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same
            page and in the loop.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm ring ring-neutral-400/50 hover:ring-neutral-400">
          <Users className="h-10 w-10 text-purple-600" />
          <h3 className="mt-4 text-xl font-semibold">User Management</h3>
          <p className="mt-2 text-gray-600">
            An all-in-one customer service platform that helps you balance everything your customers
            need to be happy.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm ring ring-neutral-400/50 hover:ring-neutral-400">
          <Layers className="h-10 w-10 text-purple-600" />
          <h3 className="mt-4 text-xl font-semibold">Seamless Modules</h3>
          <p className="mt-2 text-gray-600">
            Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same
            page and in the loop.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm ring ring-neutral-400/50 hover:ring-neutral-400 md:col-span-2">
          <TrendingUp className="h-10 w-10 text-purple-600" />
          <h3 className="mt-4 text-xl font-semibold">Performance Insights</h3>
          <p className="mt-2 text-gray-600">
            An all-in-one customer service platform that helps you balance everything your customers
            need to be happy.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm ring ring-neutral-400/50 hover:ring-neutral-400">
          <Lock className="h-10 w-10 text-purple-600" />
          <h3 className="mt-4 text-xl font-semibold">Secure & Reliable</h3>
          <p className="mt-2 text-gray-600">
            Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same
            page and in the loop.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;

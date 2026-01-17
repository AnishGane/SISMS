import { Layers, Lock, MessageCircleMore, TrendingUp, Users } from 'lucide-react';
import { motion } from 'motion/react';
import type { JSX } from 'react';

const ICON_CLASS = 'size-10 text-[#0082CE]';
const features = [
  {
    icon: <MessageCircleMore className={ICON_CLASS} />,
    title: 'Smart Analytics',
    description:
      ' Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
  },
  {
    icon: <Users className={ICON_CLASS} />,
    title: 'User Management',
    description:
      ' Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
  },
  {
    icon: <Layers className={ICON_CLASS} />,
    title: 'Seamless Modules',
    description:
      ' Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
  },
  {
    icon: <TrendingUp className={ICON_CLASS} />,
    title: 'Performance Insights',
    description:
      '  An all-in-one customer service platform that helps you balance everything your customers need to be happy.',
  },
  {
    icon: <Lock className={ICON_CLASS} />,
    title: 'Secure & Reliable',
    description:
      ' Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
  },
];

const Features = () => {
  return (
    <section id="features" className="my-18 space-y-4 border-neutral-300">
      <h1 className="text-4xl font-semibold">Powerful Features</h1>
      <p className="mx-auto max-w-2xl text-lg leading-6 text-neutral-500">
        Powerful, self-serve product and effective to help you manage your inventory and sales.
        Trusted by over 4,000 startups.
      </p>

      {/* Bento Grid */}
      <div className="mx-auto grid max-w-360 grid-cols-1 gap-6 p-10 md:grid-cols-3">
        {features.map((item, index) => (
          <FeatureCard
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            className={`${index === 3 ? 'md:col-span-2' : ''}`}
          />
        ))}
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
  className?: string;
}
const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={`rounded-xl bg-white p-8 shadow-md ring ring-neutral-400/50 hover:ring-neutral-400 ${className}`}
    >
      <div className="flex items-center gap-6">
        {icon}
        <h3 className="mt-4 text-xl font-semibold text-black">{title}</h3>
      </div>
      <p className="mt-2 text-gray-600">{description}</p>
    </motion.div>
  );
};

export default Features;

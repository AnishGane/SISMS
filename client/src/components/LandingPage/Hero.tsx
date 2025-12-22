import { CirclePlay, UserRoundPlus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import VideoModal from './VideoModal';
import Button from '../ui/Button';

const Hero = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-8 space-y-6">
      <h1 className="text-6xl font-medium">Inventory & Sales Management System</h1>
      <p className="mx-auto max-w-2xl text-xl text-neutral-500">
        Powerful, self-serve product and effective to help you manage your inventory and sales.
        Trusted by over 4,000 startups.
      </p>

      <div className="flex items-center justify-center tracking-wide">
        <Button
          title="Watch a Demo video"
          text="Watch Demo"
          icon={<CirclePlay size={17} />}
          className="btn group mr-3 rounded-md"
          onClick={() => setOpen(true)}
        />
        <Link to="/auth/admin/login">
          <Button
            title="Sign Up"
            text="Sign Up"
            icon={<UserRoundPlus size={17} />}
            className="btn rounded-md bg-[#7F56D9] text-white"
          />
        </Link>
      </div>
      <div className="relative">
        <div className="absolute h-full w-full bg-linear-to-b from-transparent via-transparent to-white"></div>
        <div className="image-container mt-20 rounded-t-[40px] bg-[#F3F3F3] px-1.5 pt-1.5 ring-2 ring-neutral-300">
          <div className="overflow-hidden rounded-t-[36px] bg-neutral-300/70 px-1 pt-1 ring-1 ring-neutral-400">
            <img
              title="Admin Dashboard Image"
              src="/images/dash1.png"
              className="rounded-t-4xl"
              alt="dash"
            />
          </div>
        </div>
      </div>
      {open && <VideoModal open={open} setOpen={setOpen} />}
    </div>
  );
};

export default Hero;

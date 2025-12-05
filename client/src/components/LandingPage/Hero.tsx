import { CirclePlay, UserRoundPlus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import VideoModal from './VideoModal';

const Hero = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-8 space-y-6">
      <h1 className="text-6xl font-semibold">Beautiful analytics to grow smarter</h1>
      <p className="mx-auto max-w-2xl text-xl text-neutral-500">
        Powerful, self-serve product and growth analytics to help you convert, engage, and retain
        more users. Trusted by over 4,000 startups.
      </p>

      <div className="tracking-wide">
        <button className="btn group mr-3 rounded-md" onClick={() => setOpen(true)}>
          <CirclePlay className="text-neutral-500 group-hover:text-gray-700" size={17} />
          <p className="text-gray-800">Watch Demo</p>
        </button>
        <Link to="/auth/admin/login">
          <button className="btn rounded-md bg-[#7F56D9] text-white">
            <UserRoundPlus size={17} />
            <p>Sign Up</p>
          </button>
        </Link>
      </div>

      <div className="image-container mt-20 rounded-t-[40px] bg-[#F3F3F3] px-1 pt-1 shadow-md ring-2 ring-neutral-300">
        <div className="overflow-hidden rounded-t-[36px] bg-neutral-300/60 px-1 pt-1 ring-1 ring-neutral-400">
          <img src="/images/dash.png" className="rounded-t-4xl" alt="dash" />
        </div>
      </div>
      {open && <VideoModal open={open} setOpen={setOpen} />}
    </div>
  );
};

export default Hero;

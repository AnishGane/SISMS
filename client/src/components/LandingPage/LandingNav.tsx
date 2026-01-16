import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const LandingNav = () => {
  return (
    <div className="ring-base-100 sticky top-0 z-99 w-full bg-transparent pt-2 backdrop-blur-sm xl:px-18">
      <nav className="flex w-full items-center justify-between rounded-full bg-transparent px-6 py-1.5">
        <Link to={'/'} onClick={() => window.scrollTo(0, 0)}>
          <img
            src="/images/Logo.jpeg"
            alt="Logo"
            className="size-16 cursor-pointer object-contain"
          />
        </Link>
        <ul className="flex cursor-pointer items-center gap-6 tracking-wide">
          <li className="group">
            About Us
            <hr className="h-px w-0 transition-all duration-200 group-hover:w-full" />
          </li>
          <li className="group">
            <a href="#features">Features</a>
            <hr className="h-px w-0 transition-all duration-200 group-hover:w-full" />
          </li>
          <li className="group">
            <a href="#faqs">FAQs</a>
            <hr className="h-px w-0 transition-all duration-200 group-hover:w-full" />
          </li>
          <Link to={'/contact'}>
            <Button
              title="Contact us"
              text="Contact"
              className="btn text-base-100 ml-4 rounded-lg bg-[#0082CE] px-3.5 font-normal tracking-wider"
            />
          </Link>
        </ul>
      </nav>
    </div>
  );
};

export default LandingNav;

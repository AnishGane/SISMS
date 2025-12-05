import { Link } from 'react-router-dom';

const LandingNav = () => {
  return (
    <div className="ring-base-100 bg-base-100 sticky top-0 z-99 w-full rounded-b-lg pt-2 ring">
      <nav className="flex w-full items-center justify-between rounded-lg px-4 py-1.5 shadow-xs ring ring-neutral-200">
        <Link to={'/'} onClick={() => window.scrollTo(0, 0)}>
          <img
            src="/images/Logo.jpeg"
            alt="Logo"
            className="size-13 cursor-pointer object-contain"
          />
        </Link>
        <ul className="flex cursor-pointer items-center gap-6">
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
            <button className="btn text-base-100 ml-4 rounded-md bg-[#7F56D9] font-normal">
              Contact
            </button>
          </Link>
        </ul>
      </nav>
    </div>
  );
};

export default LandingNav;

type FooterDataProps = {
  title: string;
  data: string[];
};

const footerData: FooterDataProps[] = [
  {
    title: 'Products',
    data: ['Overview', 'Features', 'Solutions', 'Tutorials', 'Pricing', 'Releases'],
  },
  {
    title: ' Company',
    data: ['About us', 'Careers', 'Press', 'News', 'Media kit', 'Contact'],
  },
  {
    title: 'Resources',
    data: ['Blog', 'Newsletter', 'Events', 'Help centre', 'Tutorials', 'Support'],
  },

  {
    title: 'Use cases',
    data: ['Startups', 'Enterprise', 'SaaS centre', 'Government', 'Marketplaces', 'Ecommerce'],
  },

  {
    title: 'Social',
    data: ['Twitter', 'LinkedIn', 'Facebook', 'GitHub', 'AngelList', 'Dribbble'],
  },
  {
    title: 'Legal',
    data: ['Licenses', 'Terms', 'Privacy', 'Cookies', 'Settings', 'Contact'],
  },
];

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col">
        <div className="mt-4 grid gap-4 py-8 md:grid-cols-3 lg:grid-cols-6">
          {footerData.map((item) => (
            <div key={item.title} className="mx-auto text-left text-[#535862]">
              <p className="font-medium text-[20px]">{item.title}</p>
              <div className="mt-4 flex w-fit cursor-pointer flex-col gap-2 text-[19px] font-medium">
                {item.data.map((data) => (
                  <p
                    key={data}
                    className=" text-[15px] group hover:text-base-content w-fit cursor-pointer transition-all duration-200"
                  >
                    {data}
                    <hr className="-mt-1 w-0 transition-all duration-200 group-hover:w-full" />
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full items-center justify-between border-t border-gray-600/50 py-8">
          <h1 className="text-xl font-medium text-neutral-800">
            Inventory & Sales Management System
          </h1>
          <p className="tracking-wide text-sm text-neutral-600">© 2082 SISMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

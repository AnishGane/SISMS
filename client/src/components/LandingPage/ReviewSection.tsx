import upleveled from '@/assets/svg/upleveled.svg';
import popper from '@/assets/svg/poper.svg';
import papper from '@/assets/svg/paper.svg';
import Lotti from '@/assets/svg/Lotti.svg';
import soldera from '@/assets/svg/soldera.svg';

type ReviewItem = {
  id: number;
  type: 'review';
  title: string;
  logo?: string;
  review: string;
  user: {
    name: string;
    role: string;
    avatar: string;
  };
};

type ReviewCardProps = {
  data: ReviewItem;
};

const reviewData: ReviewItem[] = [
  {
    id: 1,
    type: 'review',
    title: 'ZebraTech',
    logo: papper,
    review:
      'The onboarding process was as smooth as butter. Our workflows improved overnight, and everyone loves the new dashboard!',
    user: {
      name: 'Avi Patel',
      role: 'Lead Engineer, ZebraTech',
      avatar: '/images/av_2.avif',
    },
  },
  {
    id: 2,
    type: 'review',
    title: 'PixelPulse',
    logo: soldera,
    review:
      "I've never seen our design and marketing teams collaborate so efficiently. Kudos to the dev team for building something this seamless!",
    user: {
      name: 'Sofia Lin',
      role: 'Creative Director',
      avatar: '/images/av_1.avif',
    },
  },
  {
    id: 3,
    type: 'review',
    title: 'CodeNest',
    logo: upleveled,
    review:
      'Feature-rich and easy to use. We rolled out two product launches ahead of schedule thanks to these tools.',
    user: {
      name: 'Miguel Santos',
      role: 'PM, CodeNest',
      avatar: '/images/av_3.avif',
    },
  },
  {
    id: 4,
    type: 'review',
    title: 'CloudCartel',
    logo: Lotti,
    review:
      'From templates to real-time updates, everything just works out of the box. Even our interns love it.',
    user: {
      name: 'Jessica Brown',
      role: 'CEO, CloudCartel',
      avatar: '/images/av_2.avif',
    },
  },
  {
    id: 5,
    type: 'review',
    title: 'NeonFrame',
    logo: popper,
    review:
      'Support is super fast, and the integration with our old systems was painless. Would recommend to any SaaS startup!',
    user: {
      name: 'Oliver Grant',
      role: 'Operations Manager',
      avatar: '/images/av_1.avif',
    },
  },
  {
    id: 6,
    type: 'review',
    title: 'BrightBits',
    logo: soldera,
    review:
      "Absolutely love the dark mode and automation flow. It's now indispensable for our remote team.",
    user: {
      name: 'Fatima Zahra',
      role: 'Remote Team Lead',
      avatar: '/images/av_3.avif',
    },
  },
  {
    id: 7,
    type: 'review',
    title: 'SparkBridge',
    logo: papper,
    review: 'Our workflow bottlenecks have basically disappeared. We’re never switching back.',
    user: {
      name: 'Lukas Weber',
      role: 'Founder, SparkBridge',
      avatar: '/images/av_2.avif',
    },
  },
  {
    id: 8,
    type: 'review',
    title: 'QuantumQuirk',
    logo: upleveled,
    review:
      'The analytics and reporting are second to none. We made data-driven decisions with confidence this quarter.',
    user: {
      name: 'Mei Chen',
      role: 'Data Analyst',
      avatar: '/images/av_1.avif',
    },
  },
  {
    id: 9,
    type: 'review',
    title: 'RetroRocket',
    logo: Lotti,
    review:
      'UI is super clean. Task assignments are clear and the feedback loops are tight. Our team loves the new workflow!',
    user: {
      name: 'Ethan Rivera',
      role: 'Scrum Master',
      avatar: '/images/av_3.avif',
    },
  },
];

const ReviewCard = ({ data }: ReviewCardProps) => {
  return (
    <div className="rounded-2xl bg-white px-6 py-8 shadow-sm ring ring-neutral-200">
      <div className="flex items-start gap-1.5">
        <img src={data.logo} className="size-7" alt={data.logo} />
        <h2 className="text-xl leading-5.5 font-semibold">{data.title}</h2>
      </div>
      <p className="mt-5 mb-10 ml-1 text-left leading-6 text-neutral-600">{data.review}</p>

      <div className="flex gap-2.5">
        <img
          src={data.user.avatar}
          className="size-11 rounded-full object-cover"
          alt={data.user.name}
        />
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1">
            <h4 className="text-lg leading-5.5 font-semibold">{data.user.name}</h4>

            {/* Verified check */}
            <svg
              data-verified="true"
              className="text-utility-blue-500 z-10 size-3.5"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path
                d="M7.72237 1.77098C7.81734 2.00068 7.99965 2.18326 8.2292 2.27858L9.03413 2.61199C9.26384 2.70714 9.44635 2.88965 9.5415 3.11936C9.63665 3.34908 9.63665 3.60718 9.5415 3.83689L9.20833 4.64125C9.11313 4.87106 9.113 5.12943 9.20863 5.35913L9.54122 6.16325C9.58839 6.27702 9.61268 6.39897 9.6127 6.52214C9.61272 6.6453 9.58847 6.76726 9.54134 6.88105C9.4942 6.99484 9.42511 7.09823 9.33801 7.18531C9.2509 7.27238 9.14749 7.34144 9.03369 7.38854L8.22934 7.72171C7.99964 7.81669 7.81706 7.99899 7.72174 8.22855L7.38833 9.03348C7.29318 9.26319 7.11067 9.4457 6.88096 9.54085C6.65124 9.636 6.39314 9.636 6.16343 9.54085L5.35907 9.20767C5.12935 9.11276 4.87134 9.11295 4.64177 9.20821L3.83684 9.54115C3.60725 9.63608 3.34937 9.636 3.11984 9.54092C2.89032 9.44585 2.70791 9.26356 2.6127 9.03409L2.27918 8.22892C2.18421 7.99923 2.0019 7.81665 1.77235 7.72133L0.967421 7.38792C0.737807 7.29281 0.555355 7.11041 0.460169 6.88083C0.364983 6.65125 0.364854 6.39327 0.45981 6.16359L0.792984 5.35924C0.8879 5.12952 0.887707 4.87151 0.792445 4.64193L0.459749 3.83642C0.41258 3.72265 0.388291 3.60069 0.388272 3.47753C0.388252 3.35436 0.412501 3.2324 0.459634 3.11861C0.506767 3.00482 0.57586 2.90144 0.662965 2.81436C0.75007 2.72728 0.853479 2.65822 0.967283 2.61113L1.77164 2.27795C2.00113 2.18306 2.1836 2.00099 2.27899 1.7717L2.6124 0.966768C2.70755 0.737054 2.89006 0.554547 3.11978 0.459397C3.34949 0.364246 3.60759 0.364246 3.83731 0.459397L4.64166 0.792571C4.87138 0.887487 5.12939 0.887293 5.35897 0.792031L6.16424 0.459913C6.39392 0.364816 6.65197 0.364836 6.88164 0.459968C7.11131 0.555099 7.29379 0.737554 7.38895 0.967208L7.72247 1.77238L7.72237 1.77098Z"
                fill="blue"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.95829 3.68932C7.02509 3.58439 7.04747 3.45723 7.02051 3.3358C6.99356 3.21437 6.91946 3.10862 6.81454 3.04182C6.70961 2.97502 6.58245 2.95264 6.46102 2.97959C6.33959 3.00655 6.23384 3.08064 6.16704 3.18557L4.33141 6.06995L3.49141 5.01995C3.41375 4.92281 3.30069 4.8605 3.17709 4.84673C3.05349 4.83296 2.92949 4.86885 2.83235 4.94651C2.73522 5.02417 2.67291 5.13723 2.65914 5.26083C2.64536 5.38443 2.68125 5.50843 2.75891 5.60557L4.00891 7.16807C4.0555 7.22638 4.11533 7.27271 4.18344 7.30323C4.25154 7.33375 4.32595 7.34757 4.40047 7.34353C4.47499 7.3395 4.54747 7.31773 4.61188 7.28004C4.67629 7.24234 4.73077 7.18981 4.77079 7.12682L6.95829 3.68932Z"
                fill="white"
              ></path>
            </svg>
          </div>
          <p className="text-neutral-500">{data.user.role}</p>
        </div>
      </div>
    </div>
  );
};

const ReviewSection = () => {
  return (
    <section className="relative py-8">
      {/* Overlay background */}
      <div className="absolute inset-0 z-50 h-full w-full bg-linear-to-b from-transparent via-transparent to-white"></div>
      <div className="my-12 mb-20 space-y-2">
        <h1 className="text-4xl font-medium">Our Reviews</h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-500">
          Hear first-hand from our incredible community of customers.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="mt-12 flex flex-col gap-8">
          {reviewData.slice(0, 3).map((item) => (
            <ReviewCard key={item.id} data={item} />
          ))}
        </div>

        <div className="flex flex-col gap-8">
          {reviewData.slice(3, 6).map((item) => (
            <ReviewCard key={item.id} data={item} />
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-8">
          {reviewData.slice(6, 9).map((item) => (
            <ReviewCard key={item.id} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;

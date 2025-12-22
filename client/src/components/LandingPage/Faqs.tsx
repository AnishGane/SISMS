import { CircleMinus, CirclePlus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
type FaqsDataProps = {
  q: string;
  a: string;
};

const faqsData: FaqsDataProps[] = [
  {
    q: 'What is a team inbox?',
    a: 'Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
  },
  {
    q: 'What is a team inbox?',
    a: 'Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
  },
  {
    q: 'What is a team inbox?',
    a: 'Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
  },
  {
    q: 'What is a team inbox?',
    a: 'Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
  },
  {
    q: 'What is a team inbox?',
    a: 'Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
  },
];
const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <section id="faqs" className="mb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold">Frequently Asked Questions</h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-500">
          Everything you need to know about the product and billing.
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-4xl space-y-4">
        {faqsData.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="overflow-hidden rounded-lg border border-gray-200 transition-colors duration-200"
              role="listitem"
            >
              <button
                className="flex w-full cursor-pointer items-center justify-between p-4 text-left"
                onClick={() => toggleFAQ(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${index}`}
                id={`faq-header-${index}`}
              >
                <h3 className="font-medium md:text-[17px]">{faq.q}</h3>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  {!isOpen ? (
                    <CirclePlus className="cursor-pointer " aria-hidden="true" />
                  ) : (
                    <CircleMinus className="cursor-pointer " aria-hidden="true" />
                  )}
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="overflow-hidden"
                    id={`faq-content-${index}`}
                    role="region"
                    aria-labelledby={`faq-header-${index}`}
                  >
                    <p className="pr-12 pb-5 pl-4 text-left text-[13px] leading-relaxed text-gray-400 md:text-[17px]">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Faqs;

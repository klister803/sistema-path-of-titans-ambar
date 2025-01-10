import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  questions: FAQ[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ questions }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="space-y-4">
      {questions.map((faq, index) => (
        <motion.div
          key={index}
          initial={false}
          className="border border-[rgba(var(--color-gold),0.2)] rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left text-[rgb(var(--color-gold))]
                     hover:bg-[rgba(var(--color-gold),0.1)] transition-colors"
          >
            <span className="font-medium">{faq.question}</span>
            <ChevronDown
              size={20}
              className={`transform transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-4 pb-4"
              >
                <p className="text-[rgba(var(--color-gold),0.8)]">
                  {faq.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

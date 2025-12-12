import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "react-feather";

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqProps {
    title: string;
    description: string;
    faq_list: FaqItem[];
}

const Faq: React.FC<FaqProps> = ({ title, description, faq_list }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // Structured Data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq_list.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer,
            },
        })),
    };

    return (
        <section className="section overflow-hidden">
            <div className="container">
                <div className="mx-auto max-w-3xl text-center mb-10">
                    <h2 className="mb-4" dangerouslySetInnerHTML={{ __html: title }} />
                    <p className="text-lg text-text-secondary" dangerouslySetInnerHTML={{ __html: description }} />
                </div>
                <div className="mx-auto max-w-3xl">
                    <div className="flex flex-col gap-4">
                        {faq_list.map((item, index) => (
                            <div
                                key={index}
                                className={`border rounded-lg overflow-hidden transition-colors duration-300 ${activeIndex === index
                                    ? "border-primary bg-surface shadow-lg"
                                    : "border-border bg-theme-light dark:bg-darkmode-theme-light"
                                    }`}
                            >
                                <button
                                    className="flex justify-between items-center w-full p-5 text-left focus:outline-none cursor-pointer"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <span className="font-bold text-lg pr-4">{item.question}</span>
                                    <motion.span
                                        animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-primary flex-shrink-0"
                                    >
                                        <ChevronDown />
                                    </motion.span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            style={{ overflow: "hidden" }}
                                        >
                                            <div
                                                className="px-5 pb-5 text-text-secondary"
                                                dangerouslySetInnerHTML={{ __html: item.answer }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </section>
    );
};

export default Faq;

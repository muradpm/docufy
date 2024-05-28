"use client";

import { Disclosure } from "@headlessui/react";
import { Minus, Plus } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "Do you use AI?",
    answer:
      "Yes, we use fine-tuned GPT-3.5 model to provide you with the best writing experience.",
  },
  {
    id: 2,
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, you can cancel your plan at any time. You will still have access to all documents previously created.",
  },
  {
    id: 4,
    question: "Do you offer refunds?",
    answer:
      "We currently do not offer refunds. However, you can cancel your subscription at any time, after which you won't be charged again.",
  },
  {
    id: 5,
    question: "Can I delete my account?",
    answer: "Yes, you can delete your account and download all your documents.",
  },
  {
    id: 6,
    question: "How does the word count work?",
    answer:
      'We count words by looking at the spaces between them. In a sentence like "I love writing", we see this as three separate words "I", "love", and "writing".',
  },
  {
    id: 7,
    question: "What payment methods are available?",
    answer:
      "We accept all major credit cards via Stripe. We do not accept Bitcoin or other cryptocurrencies at this time.",
  },
  {
    id: 8,
    question: "Where the document stored, is it secure?",
    answer:
      "Yes, we store all your documents in a secure way. We use AWS S3 to store your documents and we encrypt all your data.",
  },
];

export default function Faqs() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4x">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600">
            Have a different question and can’t find the answer you’re looking for? Reach
            out to our support team by{" "}
            <a
              href="mailto:murad@docufy.ai"
              className="font-semibold text-gray-600 hover:text-gray-500"
            >
              sending us an email
            </a>{" "}
            and we&apos;ll get back to you as soon as we can.
          </p>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure
                as="div"
                key={faq.question}
                className="pt-6"
                defaultOpen={faq.id === 1}
              >
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <Minus className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <Plus className="h-6 w-6 text-gray-500" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

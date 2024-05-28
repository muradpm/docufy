"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Check } from "lucide-react";
import Link from "next/link";

type PriceFrequency = "monthly" | "annually";

const frequencies = [
  {
    value: "monthly" as PriceFrequency,
    label: "Monthly",
    priceSuffix: "/month",
  },
  {
    value: "annually" as PriceFrequency,
    label: "Annually",
    priceSuffix: "/year",
  },
];

const tiers = [
  {
    name: "Hobby",
    id: "tier-hobby",
    href: "#",
    price: { monthly: "$5", annually: "$50" },
    description: "The perfect plan if you're just getting started.",
    features: [
      "Unlimited documents",
      "50 daily AI context analysis between documents",
      "50 daily AI spelling and grammar checkers",
      "50 daily AI text autocompletions",
      "Writing analytics",
      "48-hour support response time",
    ],
    actionLabel: "Start free trial",
    featured: false,
    trial: true,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    price: { monthly: "$49", annually: "$490" },
    description: "Empower your writing with the best AI.",
    features: [
      "Unlimited documents",
      "Unlimited AI context analysis between documents",
      "Unlimited AI spelling and grammar checkers",
      "Unlimited AI text autocompletions",
      "Advanced writing analytics",
      "Shared document links",
      "Usage reports",
      "1:1 onboarding tour",
      "24-hour support response time",
    ],
    actionLabel: "Get started today",
    featured: true,
    trial: false,
  },
];

function classNames(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

export default function Pricing() {
  const { data: session } = useSession();
  const [frequency, setFrequency] = useState(frequencies[0]);

  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-blue-100 via-blue-300 to-blue-500 opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 className="text-base font-semibold leading-7 text-gray-600">
          Pricing
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600">
            Straightforward,
          </span>{" "}
          <span className="text-gray-800">tailored for your tale</span>
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        Select the plan that sings to your story&apos;s needs.
      </p>
      <div className="mt-16 flex justify-center">
        <RadioGroup
          value={frequency}
          onChange={setFrequency}
          className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
        >
          <RadioGroup.Label className="sr-only">
            Payment frequency
          </RadioGroup.Label>
          {frequencies.map((option) => (
            <RadioGroup.Option
              key={option.value}
              value={option}
              className={({ checked }) =>
                classNames(
                  checked ? "bg-gray-950 text-white" : "text-gray-500",
                  "cursor-pointer rounded-full px-2.5 py-1 transition-colors duration-150 ease-in-out"
                )
              }
            >
              <span>{option.label}</span>
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </div>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured
                ? "relative bg-gray-800 shadow-2xl"
                : "bg-white/60 sm:mx-8 lg:mx-0",
              tier.featured
                ? ""
                : tierIdx === 0
                ? "rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl"
                : "sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none",
              "rounded-3xl p-8 ring-1 ring-gray-800/10 sm:p-10"
            )}
          >
            <div className="flex items-center justify-between gap-x-4">
              <h3
                id={tier.id}
                className="text-lg font-semibold leading-8 text-white"
              >
                {/* {tier.name} */}
              </h3>
            </div>
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? "text-gray-400" : "text-gray-950",
                "text-base font-semibold leading-7"
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? "text-white" : "text-gray-800",
                  "text-5xl font-bold tracking-tight"
                )}
              >
                {tier.price[frequency.value]}
              </span>
              <span
                className={classNames(
                  tier.featured ? "text-gray-400" : "text-gray-800",
                  "text-base"
                )}
              >
                {frequency.priceSuffix}
              </span>
            </p>
            <p
              className={classNames(
                tier.featured ? "text-gray-300" : "text-gray-950",
                "mt-6 text-base leading-7"
              )}
            >
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? "text-gray-300" : "text-gray-950",
                "mt-8 space-y-3 text-sm leading-6 sm:mt-10"
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <Check
                    className={classNames(
                      tier.featured ? "text-gray-400" : "text-gray-950",
                      "h-6 w-5 flex-none"
                    )}
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={session ? "/overview" : "/login"}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? "bg-gray-700 text-white shadow-sm hover:bg-gray-600 focus-visible:outline-gray-800"
                  : "text-gray-950 ring-1 ring-inset ring-gray-200 hover:ring-gray-300 focus-visible:outline-gray-950",
                "mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
              )}
            >
              {tier.actionLabel}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

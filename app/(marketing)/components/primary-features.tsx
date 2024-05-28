"use client";

import { Sparkles, MessageSquare, Tag } from "lucide-react";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Container } from "./container";

const features = [
  {
    name: "Swift, smart, synced",
    description:
      "Turn your thoughts into text in a snap with our clever document context analysis.",
    icon: Sparkles,
    image: "/landing/screenshots/primary-feature-context.jpeg",
  },
  {
    name: "Clarity in every click",
    description:
      "Make sure your writing crystal clear every time with spelling & grammar correction.",
    icon: MessageSquare,
    image: "/landing/screenshots/primary-feature-grammar.jpeg",
  },
  {
    name: "Your writing amplified",
    description:
      "Save time and effort with text autocompletion, speeding up your writing process.",
    icon: Tag,
    image: "/landing/screenshots/primary-feature-completion.jpeg",
  },
];

export default function PrimaryFeatures() {
  const [tabOrientation, setTabOrientation] = useState<
    "horizontal" | "vertical"
  >("horizontal");

  useEffect(() => {
    const lgMediaQuery = window.matchMedia("(min-width: 1024px)");

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? "vertical" : "horizontal");
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  return (
    <div className="bg-white">
      <section
        id="features"
        aria-label="Features for running your books"
        className="relative overflow-hidden bg-gradient-to-t from-white pt-[7%] pb-28 sm:py-32"
      >
        <Container className="relative">
          <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
            <h2 className="text-base font-semibold leading-7 text-gray-600">
              Streamline accuracy
            </h2>
            <p className="mt-2 text-3xl text-gray-800 font-bold tracking-tight sm:text-4xl">
              Transform{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
                creative
              </span>{" "}
              <span className="text-gray-800">thinking</span>
            </p>
            <p className="mt-6 text-lg tracking-tight text-gray-600">
              Intuitive document organization, smart analytics, and style
              guidance at your fingertips.
            </p>
          </div>

          <Tab.Group
            as="div"
            className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
            vertical={tabOrientation === "vertical"}
          >
            {({ selectedIndex }) => (
              <>
                <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                  <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                    {features.map((feature, featureIndex) => (
                      <div
                        key={feature.name}
                        className={clsx(
                          "group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6",
                          selectedIndex === featureIndex
                            ? "bg-gray-950 lg:bg-gray-950 lg:ring-1 lg:ring-inset lg:ring-white/10"
                            : "hover:bg-gray-400/10 lg:hover:bg-gray-400/5"
                        )}
                      >
                        <h3>
                          <Tab
                            className={clsx(
                              "font-semibold ui-not-focus-visible:outline-none",
                              "text-base sm:text-lg",
                              selectedIndex === featureIndex
                                ? "text-white lg:text-white"
                                : "text-gray-400 hover:text-gray-600 lg:text-gray-600"
                            )}
                          >
                            <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                            {feature.name}
                          </Tab>
                        </h3>
                        <p
                          className={clsx(
                            "mt-2 hidden text-sm lg:block",
                            selectedIndex === featureIndex
                              ? "text-white"
                              : "text-gray-400 group-hover:text-gray-600"
                          )}
                        >
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </Tab.List>
                </div>
                <Tab.Panels className="lg:col-span-7">
                  {features.map((feature) => (
                    <Tab.Panel key={feature.name} unmount={false}>
                      <div className="relative sm:px-6 lg:hidden">
                        <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                        <p className="relative mx-auto max-w-2xl text-base text-gray-950 sm:text-center">
                          {feature.description}
                        </p>
                      </div>
                      <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-gray-50 shadow-xl shadow-gray-900/20 sm:w-auto lg:mt-0 lg:w-[60rem]">
                        <Image
                          className="w-full"
                          src={feature.image}
                          alt=""
                          priority
                          sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                          width={2432}
                          height={1442}
                        />
                      </div>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </>
            )}
          </Tab.Group>
        </Container>
      </section>
    </div>
  );
}

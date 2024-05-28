import Image from "next/image";

import {
  FileHeart,
  Share2,
  Goal,
  Sparkle,
  PieChart,
  SearchCheck,
} from "lucide-react";

const features = [
  {
    name: "Effortless document creation.",
    description: "Write essays, reports, and other documents with ease.",
    icon: FileHeart,
  },
  {
    name: "Efficient collaboration.",
    description: "Share your work, enhancing teamwork and productivity.",
    icon: Share2,
  },
  {
    name: "Performance evaluation.",
    description: "Assess your writing to pinpoint areas for improvement.",
    icon: Goal,
  },
  {
    name: "AI-powered writing enhancement:.",
    description: "Elevate your writing with AI-powered analysis.",
    icon: Sparkle,
  },
  {
    name: "Progress tracking.",
    description:
      "Stay on target by monitoring your writing progress over time.",
    icon: PieChart,
  },
  {
    name: "Insightful reporting.",
    description:
      "Track your writing progress and identify areas for improvement.",
    icon: SearchCheck,
  },
];

export default function SecondaryFeatures() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-gray-600">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Write, store and share{" "}
            </span>
            <span className="text-gray-800">your thoughts</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Experience the convenience of having everything you need in one
            place.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Image
            src="/landing/screenshots/secondary-feature.jpeg"
            alt="Feature screenshot"
            className="mb-[-8%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            width={2432}
            height={1442}
            priority
          />
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <feature.icon
                  className="absolute left-1 top-1 h-5 w-5 text-gray-600"
                  aria-hidden="true"
                />
                {feature.name}
              </dt>{" "}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

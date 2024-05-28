"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CallToAction() {
  const { data: session } = useSession();

  return (
    <div className="bg-white">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-gray-600">
            Write faster, better
          </h2>
          <h2 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            <span>Boost your</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-green-300">
              productivity
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Embrace confidence with a hassle-free writing experience.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href={session ? "/overview" : "/login"}
              className="rounded-md bg-gray-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
            >
              Get started today
            </Link>
            <Link
              href="#"
              className="text-sm font-semibold leading-6 text-gray-800"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

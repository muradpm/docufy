"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { ChevronRight } from "lucide-react";
import { Icons } from "@/components/icons";

const navigation = [
  { name: "Product", href: "hero" },
  { name: "Features", href: "primaryFeatures" },
  { name: "Pricing", href: "pricing" },
  { name: "Questions", href: "faqs" },
];

export default function Nav() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1 items-center">
            <Link href="#" className="flex items-center -m-1.5 p-1.5 ">
              <Icons.brand className="h-12 w-12" />
              <span className="ml-2 text-xl font-bold text-black">docufy</span>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-800"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <ScrollLink
                key={item.name}
                to={item.href}
                smooth={true}
                duration={500}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors ease-out  cursor-pointer"
              >
                {item.name}
              </ScrollLink>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {session ? (
              <button
                onClick={() => setIsLoading(true)}
                className="flex items-center justify-center rounded-md bg-gray-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
              >
                <Link href="/overview">
                  <span className="flex items-center">
                    {isLoading ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronRight className="mr-2 h-4 w-4" />
                    )}
                    Dashboard
                  </span>
                </Link>
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Log in
              </Link>
            )}
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-800/10">
            <div className="flex items-center justify-between">
              <Link href="#" className="flex items-center -m-1.5 p-1.5">
                <Icons.brand className="h-12 w-12" />
                <span className="ml-2 text-xl font-bold">docufy</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-800/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <ScrollLink
                      key={item.name}
                      to={item.href}
                      smooth={true}
                      duration={500}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-500 hover:text-black hover:bg-gray-50 cursor-pointer"
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </ScrollLink>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href={session ? "/overview" : "/login"}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-800 hover:bg-gray-50"
                  >
                    {session ? "Dashboard" : "Log in"}
                  </Link>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </div>
  );
}

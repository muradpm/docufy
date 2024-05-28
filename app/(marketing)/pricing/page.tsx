"use client";

import React, { Suspense, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { CalendarDays, CalendarRange } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import PricingLoading from "./loading";

interface StripeResponse {
  url: string;
}

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
};

type PricingCardProps = {
  id: string;
  isAnnually?: boolean;
  title: string;
  monthlyPrice?: number;
  annuallyPrice?: number;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  exclusive?: boolean;
  onActionClick: (planId: string) => void;
  isLoading: string | null;
};

const PricingHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <section className="text-center">
    <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
      {title}
    </h2>
    <p
      className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-white"
      dangerouslySetInnerHTML={{ __html: subtitle }}
    />
    <br />
  </section>
);

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="1" className="w-40 mx-auto" onValueChange={onSwitch}>
    <TabsList>
      <TabsTrigger value="0">
        <CalendarDays className="mr-2 h-4 w-4" />
        Monthly
      </TabsTrigger>
      <TabsTrigger value="1">
        <CalendarRange className="mr-2 h-4 w-4" /> Annually
      </TabsTrigger>
    </TabsList>
  </Tabs>
);

const PricingCard = ({
  id,
  isAnnually,
  title,
  monthlyPrice,
  annuallyPrice,
  description,
  features,
  actionLabel,
  popular,
  exclusive,
  onActionClick,
  isLoading,
}: PricingCardProps) => (
  <Card
    className={cn(
      `w-400 flex flex-col justify-between py-1 rounded-3xl ${
        popular ? "ring-2 ring-indigo-600" : ""
      } mx-auto sm:mx-0`,
      {
        "animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors":
          exclusive,
      }
    )}
  >
    <div>
      <CardHeader className="pb-8 pt-4">
        {isAnnually && annuallyPrice && monthlyPrice ? (
          <div className="flex justify-between">
            <CardTitle className="text-gray-700 dark:text-gray-300 text-lg">
              {title}
            </CardTitle>
            <div
              className={cn(
                "px-2.5 rounded-xl h-fit text-sm font-semibold leading-5 py-1 bg-gray-200 text-black dark:bg-gray-800 dark:text-white",
                {
                  "bg-gradient-to-r from-indigo-500 to-indigo-400 dark:text-white ":
                    popular,
                }
              )}
            >
              Save ${monthlyPrice * 12 - annuallyPrice}
            </div>
          </div>
        ) : (
          <CardTitle className="text-gray-950 dark:text-gray-400 text-base font-semibold leading-7">
            {title}
          </CardTitle>
        )}
        <div className="flex gap-0.5">
          <h3 className="text-5xl font-bold tracking-tight">
            {annuallyPrice && isAnnually
              ? "$" + annuallyPrice
              : monthlyPrice
              ? "$" + monthlyPrice
              : "Custom"}
          </h3>
          <span className="flex flex-col justify-end text-sm mb-1">
            {annuallyPrice && isAnnually
              ? "/year"
              : monthlyPrice
              ? "/month"
              : null}
          </span>
        </div>
        <CardDescription className="pt-1.5 mt-6 text-base leading-7">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {features.map((feature: string) => (
          <CheckItem key={feature} text={feature} />
        ))}
      </CardContent>
    </div>
    <CardFooter className="mt-2">
      <Button
        className="relative inline-flex w-full items-center justify-center px-6 text-center text-sm font-semibold"
        onClick={() => onActionClick(id)}
      >
        <div className="absolute -inset-0.5 -z-10 rounded-lg" />
        {isLoading === id ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.billing className="mr-2 h-4 w-4" />
        )}
        {actionLabel}
      </Button>
    </CardFooter>
  </Card>
);

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <Check size={18} className="h-6 w-5 flex-none text-gray-600" />
    <p className="pt-0.5 text-gray-700 dark:text-gray-300 text-sm">{text}</p>
  </div>
);

export default function PricingTable() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isAnnually, setIsAnnually] = useState(true);
  const togglePricingPeriod = (value: string) =>
    setIsAnnually(parseInt(value) === 1);

  const plans = [
    {
      id: "hobby",
      title: "Hobby",
      monthlyPrice: 5,
      annuallyPrice: 50,
      description: "The perfect plan if you're just getting started.",
      features: [
        "50 daily AI context analysis between documents",
        "50 daily AI spelling and grammar checkers",
        "50 daily AI text autocompletions",
        "Writing analytics",
        "48-hour support response time",
      ],
      actionLabel: "Try it now",
    },
    {
      id: "pro",
      title: "Pro",
      monthlyPrice: 49,
      annuallyPrice: 490,
      description: "Empower your writing with the best AI.",
      features: [
        "Unlimited AI context analysis between documents",
        "Unlimited AI spelling and grammar checkers",
        "Unlimited AI text autocompletions",
        "Advanced writing analytics",
        "Shared document links",
        "Usage reports",
        "1:1 onboarding tour",
        "24-hour support response time",
      ],
      actionLabel: "Try it now",
      popular: true,
      exclusive: true,
    },
  ];

  const handleActionClick = async (planId: string) => {
    setIsLoading(planId);
    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId, isAnnually }),
      });

      if (!response.ok) {
        // console.log(`Error: ${response.status} ${response.statusText}`);
        return toast({
          title: "Something went wrong",
          description: "Please refresh the page and try again.",
          variant: "destructive",
        });
      }

      const data: StripeResponse = await response.json();
      window.location.href = data.url;
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      setIsLoading(null);
    }
  };

  return (
    <Suspense fallback={<PricingLoading />}>
      <div className="py-8">
        <PricingHeader
          title="Pricing"
          subtitle="Choose a plan to start your <strong>7-days free trial</strong>.<br /> You can change or cancel at any time."
        />
        <PricingSwitch onSwitch={togglePricingPeriod} />
        <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
          {plans.map((plan) => {
            return (
              <PricingCard
                key={plan.title}
                {...plan}
                isAnnually={isAnnually}
                onActionClick={() => handleActionClick(plan.id)}
                isLoading={isLoading}
              />
            );
          })}
        </section>
      </div>
    </Suspense>
  );
}

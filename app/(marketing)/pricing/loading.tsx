import { Skeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <div className="p-8">
      <Skeleton className="h-12 rounded w-full mb-6" />
      <div className="flex justify-center mb-6">
        <Skeleton className="h-10 rounded w-24 mr-4" />
        <Skeleton className="h-10 rounded w-24" />
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-10">
        <div className="flex-1">
          <Skeleton className="h-96 rounded-lg" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function SettingLoading() {
  return (
    <div className="p-8">
      <div className="flex">
        <div className="flex-1">
          {Array.from({ length: 2 }).map((_, sectionIndex) => (
            <div key={sectionIndex} className="mb-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className="h-10 rounded w-full mb-2" />
              ))}
            </div>
          ))}
          <Skeleton className="h-12 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

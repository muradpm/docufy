import { Skeleton } from "@/components/ui/skeleton";

export default function TextEditorLoading() {
  return (
    <div className="p-8">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-[38px] w-[90px]" />
        <div className="flex items-center justify-between gap-x-4">
          <Skeleton className="h-[38px] w-[80px]" />
          <Skeleton className="h-[38px] w-[80px]" />
        </div>
      </div>
      <Skeleton className="h-96 rounded-lg mt-4" />
    </div>
  );
}

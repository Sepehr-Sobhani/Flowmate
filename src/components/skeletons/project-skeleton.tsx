import { Skeleton } from "@/components/ui/skeleton";

export function ProjectSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Divider Skeleton */}
      <div className="border-b border-border mb-6" />

      {/* Pipeline Board Skeleton */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-80">
            <div className="h-64 bg-muted/50 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

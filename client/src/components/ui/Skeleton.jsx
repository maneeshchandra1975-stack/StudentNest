import * as React from "react";
import { cn } from "../../utils/cn";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-muted/80", className)}
      {...props}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="sn-card overflow-hidden space-y-3">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-2 border-t border-border flex justify-between">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton };
export default Skeleton;

import { cn } from "@/lib/utils";
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-2xl bg-white/12", className)} {...props} />;
}

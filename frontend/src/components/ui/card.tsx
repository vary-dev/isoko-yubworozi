import * as React from "react";
import { cn } from "@/lib/utils";

/* Borderless surface card: separated by whitespace, rounded corners and a very soft shadow. */
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-[1.75rem] bg-white text-isoko-text shadow-soft", className)} {...props} />
));
Card.displayName = "Card";
export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("p-6 pb-3", className)} {...props} />;
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex flex-1 flex-col p-6 pt-3", className)} {...props} />;
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={cn("font-display text-xl font-bold tracking-[-.025em] text-isoko-forest", className)} {...props} />;
export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className={cn("text-base leading-7 text-isoko-muted", className)} {...props} />;

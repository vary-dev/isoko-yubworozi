import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-extrabold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-isoko-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[.98]",
  {
    variants: {
      variant: {
        primary: "bg-isoko-accent text-white shadow-[0_14px_35px_rgba(76,159,56,.28)] hover:-translate-y-0.5 hover:bg-[#5bb545]",
        glass: "border border-white/25 bg-white/10 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/18",
        outline: "border border-isoko-dark/15 bg-white text-isoko-dark hover:-translate-y-0.5 hover:border-isoko-accent hover:text-isoko-primary",
        youtube: "bg-[#e50000] text-white shadow-[0_14px_35px_rgba(229,0,0,.24)] hover:-translate-y-0.5 hover:bg-[#c90000]",
      },
      size: { default: "h-12", lg: "min-h-14 px-7 text-[15px]", icon: "h-12 w-12 p-0" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "Button";
export { Button, buttonVariants };

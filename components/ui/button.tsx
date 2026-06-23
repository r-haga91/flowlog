import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary px-5 py-3 text-primary-foreground hover:bg-primary/90",
        secondary: "border border-border bg-white/[0.04] px-5 py-3 text-foreground hover:bg-white/[0.08]",
        ghost: "px-3 py-2 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground",
        destructive: "bg-destructive px-5 py-3 text-white hover:bg-destructive/90",
      },
      size: { default: "h-11", sm: "h-9 rounded-lg px-3", lg: "h-14 rounded-2xl px-7 text-base", icon: "size-11 p-0" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

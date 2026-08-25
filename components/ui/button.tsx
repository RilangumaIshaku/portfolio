"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          variant === "primary" &&
            "btn-dark bg-[#0a0a0b] text-white hover:bg-[#1a1a1c] hover:shadow-lg active:scale-[0.98]",
          variant === "secondary" &&
            "border border-border bg-surface text-primary hover:bg-muted hover:border-muted-foreground/20 active:scale-[0.98]",
          variant === "ghost" &&
            "text-muted-foreground hover:text-primary hover:bg-muted active:scale-[0.98]",
          size === "sm" && "h-9 px-4 text-button",
          size === "md" && "h-11 px-6 text-button",
          size === "lg" && "h-12 px-7 text-button",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };

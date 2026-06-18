import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "accent";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded font-mono text-xs uppercase tracking-wider font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98]",
          // Variants
          {
            "bg-primary text-primary-foreground hover:bg-primary/90": variant === "primary",
            "bg-accent text-accent-foreground hover:bg-accent/90": variant === "accent",
            "bg-muted text-foreground hover:bg-muted/80": variant === "secondary",
            "border border-card-border bg-transparent hover:bg-card/50 text-foreground": variant === "outline",
            "hover:bg-muted/50 hover:text-foreground text-muted-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto": variant === "link",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
          },
          // Sizes
          {
            "h-9 px-3 text-sm": size === "sm",
            "h-10 px-4 py-2 text-sm": size === "md",
            "h-11 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

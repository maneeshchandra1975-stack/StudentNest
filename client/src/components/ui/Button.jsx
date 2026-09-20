import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline:
          "border border-border bg-background hover:bg-accent hover:text-accent-foreground shadow-xs",
        secondary:
          "bg-card text-foreground border border-border hover:bg-muted hover:border-border/80 shadow-xs",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        emerald:
          "bg-success text-success-foreground hover:bg-success/90 shadow-sm shadow-success/20",
        teal:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm shadow-secondary/20",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-9 rounded-lg px-3 text-xs gap-1.5",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-11 rounded-xl px-6 text-base gap-2.5",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      isLoading = false,
      isDisabled = false,
      fullWidth = false,
      icon: Icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isBtnDisabled = disabled || isDisabled || isLoading;

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={isBtnDisabled}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : Icon ? (
          <Icon className="w-4 h-4 shrink-0" />
        ) : null}
        {children ? <span>{children}</span> : null}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;

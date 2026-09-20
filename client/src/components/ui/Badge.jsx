import * as React from "react";
import { cva } from "class-variance-authority";
import { ShieldCheck } from "lucide-react";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border tracking-tight shadow-2xs",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
        destructive:
          "border-transparent bg-destructive/15 text-destructive border-destructive/20",
        outline:
          "text-foreground border-border",
        verified:
          "bg-success/10 text-success border-success/25 font-bold",
        active:
          "bg-success/10 text-success border-success/25 font-bold",
        success:
          "bg-success/10 text-success border-success/25 font-bold",
        pending:
          "bg-warning/10 text-warning border-warning/25 font-bold",
        completed:
          "bg-primary/10 text-primary border-primary/25 font-bold",
        inactive:
          "bg-muted text-muted-foreground border-border",
        overdue:
          "bg-destructive/10 text-destructive border-destructive/25 font-bold",
        upcoming:
          "bg-warning/10 text-warning border-warning/25 font-bold",
        high:
          "bg-destructive/10 text-destructive border-destructive/25 font-bold",
        medium:
          "bg-warning/10 text-warning border-warning/25 font-bold",
        low:
          "bg-muted text-muted-foreground border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant = "default", children, ...props }) {
  const isVerifiedBadge = variant === "verified" && !children;

  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {isVerifiedBadge ? (
        <>
          <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />
          <span>✓ Verified Student</span>
        </>
      ) : (
        children
      )}
    </span>
  );
}

export { Badge, badgeVariants };
export default Badge;

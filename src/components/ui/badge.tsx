import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border hairline px-2.5 py-0.5 text-[11px] font-mono font-medium tracking-wide w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-black/[0.04] text-[#0B0D10] border-black/10 dark:bg-white/[0.08] dark:text-white dark:border-white/15",
        secondary:
          "bg-studio-light text-muted-dark border-black/10 dark:bg-surface-dark dark:text-muted",
        destructive:
          "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50",
        outline:
          "border-black/15 text-[#0B0D10] bg-transparent dark:border-white/15 dark:text-white",
        orange:
          "bg-[#FF5A1F]/10 text-[#FF5A1F] border-[#FF5A1F]/30 font-semibold",
        mint:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
        periwinkle:
          "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400",
        ink:
          "bg-[#0B0D10] text-white border-white/15",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

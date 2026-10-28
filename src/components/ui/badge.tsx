import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-xs border-2 border-ink px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 shadow-brutal-sm transition-transform hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "bg-[#FFE14D] text-[#0B0B0B]",
        secondary:
          "bg-[#FFF4E0] text-[#0B0B0B]",
        destructive:
          "bg-destructive text-white",
        outline:
          "bg-white text-[#0B0B0B]",
        orange:
          "bg-[#FF5A1F] text-[#0B0B0B]",
        mint:
          "bg-[#7CF2C1] text-[#0B0B0B]",
        periwinkle:
          "bg-[#8EA2FF] text-[#0B0B0B]",
        ink:
          "bg-[#0B0B0B] text-[#FFF4E0]",
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

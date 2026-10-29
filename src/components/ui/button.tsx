import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs sm:text-sm font-display font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF5A1F] focus-visible:ring-offset-2 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF5A1F] text-white hover:bg-[#E04810] shadow-precision-sm hover:shadow-precision-md hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-precision-sm active:translate-y-0",
        outline:
          "bg-white text-[#0B0D10] border hairline hover:border-black/30 hover:bg-black/[0.02] shadow-precision-xs active:translate-y-0 dark:bg-surface-dark dark:text-studio-light dark:hairline-dark dark:hover:bg-white/[0.04]",
        secondary:
          "bg-studio-light text-[#0B0D10] border hairline hover:bg-white hover:shadow-precision-xs active:translate-y-0",
        ghost:
          "text-[#0B0D10] hover:bg-black/5 dark:text-studio-light dark:hover:bg-white/5",
        link: "text-[#FF5A1F] underline-offset-4 hover:underline hover:text-[#E04810] p-0 h-auto font-medium",
        brutal:
          "bg-white text-[#0B0D10] border hairline shadow-precision-sm hover:border-black/30 hover:-translate-y-0.5",
        mint:
          "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100",
        periwinkle:
          "bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100",
        ink:
          "bg-[#0B0D10] text-white hover:bg-[#1A1F26] border border-white/10 shadow-precision-sm hover:shadow-precision-md hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-8 px-3.5 text-xs rounded-lg",
        lg: "h-12 px-7 text-sm rounded-xl",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }

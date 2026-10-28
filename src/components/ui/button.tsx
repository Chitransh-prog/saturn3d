import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xs text-sm font-display font-bold uppercase tracking-wider transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF5A1F] text-[#0B0B0B] border-3 border-ink shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-[#FF6B35]",
        destructive:
          "bg-destructive text-white border-3 border-ink shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none",
        outline:
          "bg-white text-[#0B0B0B] border-3 border-ink shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-[#FFF4E0]",
        secondary:
          "bg-[#FFE14D] text-[#0B0B0B] border-3 border-ink shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-[#FFF070]",
        ghost:
          "text-[#0B0B0B] border-2 border-transparent hover:border-ink hover:bg-white hover:shadow-brutal-sm",
        link: "text-[#FF5A1F] underline underline-offset-4 hover:text-[#0B0B0B]",
        brutal:
          "bg-[#FFF4E0] text-[#0B0B0B] border-3 border-ink shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none",
        mint:
          "bg-[#7CF2C1] text-[#0B0B0B] border-3 border-ink shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none",
        periwinkle:
          "bg-[#8EA2FF] text-[#0B0B0B] border-3 border-ink shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none",
        ink:
          "bg-[#0B0B0B] text-[#FFF4E0] border-3 border-ink shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-[#222222]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-8 px-3 text-xs",
        lg: "h-13 px-8 text-base",
        icon: "size-11",
        "icon-sm": "size-8",
        "icon-lg": "size-13",
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
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

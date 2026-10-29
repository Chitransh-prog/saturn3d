import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[#0B0D10] placeholder:text-muted selection:bg-[#FF5A1F] selection:text-white border hairline dark:hairline-dark h-11 w-full min-w-0 rounded-xl bg-white dark:bg-surface-dark px-3.5 py-2 font-mono text-xs sm:text-sm text-[#0B0D10] dark:text-studio-light shadow-precision-xs transition-all outline-hidden file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "focus-visible:border-[#FF5A1F] focus-visible:ring-2 focus-visible:ring-[#FF5A1F]/20",
        "aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }

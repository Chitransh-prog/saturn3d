import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[#0B0B0B] placeholder:text-[#777777] selection:bg-[#FF5A1F] selection:text-[#0B0B0B] border-3 border-ink h-11 w-full min-w-0 rounded-xs bg-white px-3.5 py-2 font-mono text-sm shadow-brutal-sm transition-all outline-hidden file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-bold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:bg-[#FAF7F2] focus-visible:shadow-brutal focus-visible:outline-2 focus-visible:outline-[#FF5A1F]",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }

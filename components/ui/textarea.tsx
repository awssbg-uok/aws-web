import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-white/[0.14] bg-white/[0.04] px-3 py-2 text-base text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-[#AD5CFF] focus-visible:ring-0 shadow-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

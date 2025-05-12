import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

const InputSearch = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})
InputSearch.displayName = "InputSearch"

export { InputSearch }

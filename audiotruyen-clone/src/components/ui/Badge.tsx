import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "bg-blue-600",
                full: "bg-gradient-to-br from-emerald-500 to-emerald-600",
                hot: "bg-gradient-to-br from-amber-500 to-amber-600",
                translate: "bg-gradient-to-br from-cyan-500 to-cyan-600",
                convert: "bg-gradient-to-br from-orange-500 to-orange-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }

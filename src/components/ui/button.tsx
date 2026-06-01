import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary-500 to-violet-500 text-white hover:from-primary-600 hover:to-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] border border-white/10",
        destructive:
          "bg-red-600/70 text-white hover:bg-red-500 shadow-lg shadow-red-200",
        outline:
          "border-2 border-primary-500/50 text-gray-700 dark:text-white bg-white/5 hover:bg-primary-500/10 hover:border-primary-400 backdrop-blur-sm",
        secondary:
          "bg-primary-400 hover:bg-primary-500 text-gray-900 dark:text-white border border-white/5 backdrop-blur-sm",
        ghost: "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white hover:bg-primary-500/10 dark:hover:bg-white/10",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-13 px-6 py-3 text-base",
        xs: "h-9 px-4 py-2 text-sm",
        sm: "h-10 px-4 py-2 text-sm rounded-lg",
        md: "h-11 px-6 py-3 text-base rounded-lg",
        lg: "h-12 px-8 py-4 text-lg rounded-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ComponentType<{ className?: string }>
  href?: string
  download?: boolean | string
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon: Icon, children, href, download, ...props }, ref) => {
    // Determine the component to render
    const isExternal = href?.startsWith("http")

    const content = (
      <>
        {/* Shine effect for default/primary variant */}
        {(variant === "default" || !variant) && (
          <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-full pointer-events-none skew-x-[-20deg]" />
        )}

        {loading ? (
          <svg className="animate-spin h-5 w-5 z-10" viewBox="0 0 24 24">
            <circle
              className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"
            />
            <path
              className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : Icon ? (
          <Icon className="text-xl z-10 transition-transform duration-500 group-hover:scale- group-hover:translate-x-1" />
        ) : null}

        <span className="z-10 relative">{children}</span>
      </>
    )

    const classes = cn(buttonVariants({ variant, size, className }))

    if (href) {
      const { ...anchorProps } = props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a
          href={href}
          download={download}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...anchorProps}
        >
          {content}
        </a>
      )
    }

    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={loading || props.disabled}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
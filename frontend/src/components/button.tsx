import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import Loader, { LoaderProps } from "@/components/loader";

// Define strict types for variant and size
type ButtonVariant =
    | "primary"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    isLoading?: boolean;
    loaderProps?: LoaderProps;
}

/**
 * Button Component:
 * A reusable, styled button component supporting multiple variants and sizes.
 * @param variant - Controls the button's style (primary, secondary, destructive, outline, ghost).
 * @param size - Controls the button's size (xs, sm, md, lg).
 * @param className - Additional classes for custom styling.
 * @param isLoading - Indicates if the button is in a loading state.
 * @param children - The content inside the button (e.g., text or icons).
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            className = "",
            isLoading = false,
            children,
            loaderProps,
            ...props
        },
        ref,
    ) => {
        // Variant styles
        const variantStyles: Record<ButtonVariant, string> = {
            primary:
                "bg-primary text-white hover:bg-primaryH active:bg-primaryA",
            secondary:
                "bg-secondary text-white hover:bg-secondaryH active:bg-secondaryA",
            destructive:
                "bg-destructive text-white hover:bg-destructiveH active:bg-destructiveA",
            outline:
                "border border-primary text-primary hover:bg-primary hover:text-white active:bg-primaryA",
            ghost: "bg-transparent text-primary hover:bg-gray-100 hover:text-primaryH active:bg-gray-300 active:text-primaryA",
        };

        // Size styles
        const sizeStyles: Record<ButtonSize, string> = {
            xs: "px-1.5 py-1 text-xs",
            sm: "px-2 py-1.5 text-sm",
            md: "px-3 py-2 text-sm",
            lg: "px-4 py-3 text-sm",
        };

        return (
            <button
                ref={ref}
                {...props}
                className={cn(
                    "flex w-full items-center justify-center rounded-sm leading-none transition focus:outline-none",
                    variantStyles[variant],
                    sizeStyles[size],
                    className,
                    {
                        "cursor-not-allowed opacity-60":
                            props.disabled || isLoading,
                    },
                )}
                aria-disabled={props.disabled || isLoading}
            >
                {isLoading && (
                    <div className="mr-2">
                        <Loader size="sm" {...loaderProps} />
                    </div>
                )}
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";

export default Button;

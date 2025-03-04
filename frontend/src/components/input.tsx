"use client";

import React, { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    wrapperClassName?: string;
    labelClassName?: string;
    width?: "sm" | "md" | "full";
}

/**
 * Input Component:
 * A reusable, customizable input field with optional label and size configuration.
 * @param label - Optional label text displayed above the input.
 * @param wrapperClassName - Additional classes for customizing the outer wrapper styling.
 * @param labelClassName - Additional classes for customizing the label styling.
 * @param width - Determines the width of the input field (sm, md, full).
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            type = "text",
            value,
            placeholder = "",
            className = "",
            wrapperClassName = "",
            label,
            labelClassName = "",
            width = "full",
            id,
            ...props
        },
        ref,
    ) => {
        // Map width classes to match the input's size
        const sizeClass =
            {
                sm: "w-full sm:w-64", // Small width
                md: "w-full sm:w-96", // Medium width (default)
                full: "w-full", // Large width
            }[width] || "w-full"; // Fallback to full if an invalid size is passed

        return (
            // Wrapper div with custom classes and width mapping
            <div
                className={`group grid gap-1 ${sizeClass} ${wrapperClassName}`}
            >
                {/* Optional label element */}
                {label && (
                    <label
                        htmlFor={id} // Bind label to input field using id
                        className={`order-1 mb-0 block text-xs font-medium ${labelClassName}`}
                    >
                        {label} {/* Label text */}
                    </label>
                )}
                {/* Input field with dynamic classes and custom props */}
                <input
                    ref={ref} // Forward ref to the input element
                    id={id}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    className={`peer order-2 w-full rounded-sm border border-gray-200 bg-gray-100 px-3.5 py-2 text-sm text-foreground caret-primary placeholder:text-gray-500 hover:border-gray-400 focus:border-transparent focus:outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-600 disabled:opacity-60 ${className}`}
                    aria-invalid={props["aria-invalid"] || false} // Handle invalid state with aria-invalid
                    {...props} // Spread other props like onChange, onBlur, etc.
                />
            </div>
        );
    },
);

// Set display name for the component (useful for React DevTools)
Input.displayName = "TextInput";

export default Input;

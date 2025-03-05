"use client";

import React, { forwardRef, InputHTMLAttributes } from "react";
import { v4 } from "uuid";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    wrapperClassName?: string;
    labelClassName?: string;
    width?: "sm" | "md" | "full";
    extraContent?: React.ReactNode;
    error?: string;
    description?: string;
    required?: boolean;
}

/**
 * Input Component:
 * A reusable, customizable input field with optional label and size configuration.
 * @param label - Optional label text displayed above the input.
 * @param wrapperClassName - Additional classes for customizing the outer wrapper styling.
 * @param labelClassName - Additional classes for customizing the label styling.
 * @param width - Determines the width of the input field (sm, md, full).
 * @param extraContent - Optional additional content to render alongside the input.
 * @param error - Optional error message to display below the input.
 * @param description - Optional description text to display below the input.
 * @param required - Whether the input is required.
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
            id: providedId,
            extraContent,
            error,
            description,
            required,
            "aria-describedby": ariaDescribedBy,
            ...props
        },
        ref,
    ) => {
        // Generate unique IDs for accessibility
        const [inputId, setInputId] = React.useState(providedId);

        React.useEffect(() => {
            if (!providedId) {
                setInputId(`input-${v4()}`);
            }
        }, [providedId]);

        const descriptionId = description ? `${inputId}-description` : undefined;
        const errorId = error ? `${inputId}-error` : undefined;

        // Combine aria-describedby values
        const combinedAriaDescribedBy =
            [ariaDescribedBy, descriptionId, errorId]
                .filter(Boolean)
                .join(" ") || undefined;

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
                role="group"
                aria-labelledby={label ? `${inputId}-label` : undefined}
            >
                {/* Optional label element */}
                {label && (
                    <label
                        id={`${inputId}-label`}
                        htmlFor={inputId}
                        className={`text-sm font-medium text-gray-700 ${labelClassName} ${required ? "after:ml-0.5 after:text-red-500 after:content-['*']" : ""}`}
                    >
                        {label}
                    </label>
                )}
                {/* Input wrapper with relative positioning for extra content */}
                <div className="relative">
                    {/* Input field with dynamic classes and custom props */}
                    <input
                        ref={ref} // Forward ref to the input element
                        id={inputId}
                        type={type}
                        value={value}
                        placeholder={placeholder}
                        className={`peer w-full rounded-sm border ${error ? "border-red-500" : "border-gray-200"} bg-gray-100 px-3.5 py-2 text-sm text-gray-900 caret-primary placeholder:text-gray-500 hover:border-gray-400 focus:border-transparent focus:outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                        aria-invalid={error ? "true" : "false"}
                        aria-required={required}
                        aria-describedby={combinedAriaDescribedBy}
                        {...props} // Spread other props like onChange, onBlur, etc.
                    />
                    {/* Optional extra content rendered alongside input */}
                    {extraContent}
                </div>
                {/* Optional description text */}
                {description && !error && (
                    <p id={descriptionId} className="text-sm text-gray-500">
                        {description}
                    </p>
                )}
                {/* Optional error message */}
                {error && (
                    <p
                        id={errorId}
                        className="text-sm text-red-500"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

// Set display name for the component (useful for React DevTools)
Input.displayName = "Input";

export default Input;

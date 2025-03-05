"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "@/components/input";
import { v4 } from "uuid";

/**
 * PasswordInput Component:
 * A specialized input component for password fields with show/hide functionality.
 * Extends the base Input component with additional password-specific features.
 * @param showPasswordLabel - Custom label for the show password button (optional).
 * @param hidePasswordLabel - Custom label for the hide password button (optional).
 * @param props - All props from the base Input component are supported.
 */
interface PasswordInputProps extends React.ComponentProps<typeof Input> {
    showPasswordLabel?: string;
    hidePasswordLabel?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    (
        {
            showPasswordLabel = "Show password",
            hidePasswordLabel = "Hide password",
            ...props
        },
        ref,
    ) => {
        // State to track password visibility
        const [showPassword, setShowPassword] = React.useState(false);

        // Generate unique IDs for accessibility
        const [generatedId, setGeneratedId] = React.useState("");

        React.useEffect(() => {
            setGeneratedId(`input-${v4()}`);
        }, []);

        // Toggle password visibility
        const togglePassword = () => {
            setShowPassword(!showPassword);
        };

        // Icon button component for toggling password visibility
        const IconButton = () => (
            <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={
                    showPassword ? hidePasswordLabel : showPasswordLabel
                }
                aria-pressed={showPassword}
                aria-controls={generatedId}
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                )}
            </button>
        );

        return (
            <Input
                ref={ref}
                id={generatedId}
                type={showPassword ? "text" : "password"}
                extraContent={<IconButton />}
                autoComplete="current-password"
                {...props}
            />
        );
    },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;

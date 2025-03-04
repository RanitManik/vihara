"use client";

import React, { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Define strict types for labelPosition
type LabelPosition = "left" | "right";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelPosition?: LabelPosition;
    className?: string;
    labelClassName?: string;
    onCheck?: (checked: boolean) => void;
}

/**
 * Checkbox Component:
 * A reusable, styled checkbox component supporting labels on the left or right.
 * @param label - The label text for the checkbox.
 * @param labelPosition - Position of the label relative to the checkbox (left or right).
 * @param className - Additional classes for custom styling.
 * @param labelClassName - Additional classes for custom label styling.
 * @param onCheck - Callback function triggered when the checkbox state changes.
 * @param checked - Controlled checked state.
 * @param defaultChecked - Default checked state for uncontrolled usage.
 */
const Checkbox: React.FC<CheckboxProps> = ({
    label,
    labelPosition = "right",
    className = "",
    labelClassName = "",
    onCheck,
    checked: controlledChecked,
    defaultChecked,
    ...props
}) => {
    const isControlled = controlledChecked !== undefined;
    const [checked, setChecked] = React.useState<boolean>(
        defaultChecked ?? false,
    );

    React.useEffect(() => {
        if (isControlled) {
            setChecked(controlledChecked);
        }
    }, [controlledChecked, isControlled]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newChecked = event.target.checked;

        if (!isControlled) {
            setChecked(newChecked);
        }

        if (onCheck) {
            onCheck(newChecked);
        }
    };

    // Input styles
    const inputClassNames = cn(
        "h-4 w-4 cursor-pointer focus:outline-none focus:outline-2 focus:outline-primary focus:-outline-offset-2",
        className,
    );

    // Label styles
    const labelClassNames = cn(
        "flex select-none items-center gap-2 text-sm",
        labelClassName,
    );

    return (
        <label className={labelClassNames}>
            {label && labelPosition === "left" && label}
            <input
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                className={inputClassNames}
                {...props}
            />
            {label && labelPosition === "right" && label}
        </label>
    );
};

export default Checkbox;

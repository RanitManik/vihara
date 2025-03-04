"use client";

import React, { AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Define props for the CustomLink component
interface CustomLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    className?: string;
}

/**
 * CustomLink Component:
 * A reusable, styled link component supporting multiple variants and sizes.
 * @param href - The URL to navigate to.
 * @param className - Additional classes for custom styling.
 * @param children - The content inside the link (e.g., text or icons).
 * @param props - Other Optional props
 */
const CustomLink: React.FC<CustomLinkProps> = ({
    href,
    className = "",
    children,
    ...props
}) => {
    return (
        <Link
            href={href}
            className={cn(
                "font-semibold transition focus:outline-none",
                "text-sm text-primary hover:text-primaryH active:text-primaryA",
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
};

export default CustomLink;

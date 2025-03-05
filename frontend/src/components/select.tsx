"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import Button from "@/components/button";
import ReactDOM from "react-dom";
import Input from "@/components/input";
import { cn } from "@/lib/utils";
import { v4 } from "uuid";

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps
    extends Omit<React.ComponentProps<typeof Input>, "onChange"> {
    options: Option[];
    selectedOption: Option;
    setSelectedOption: (value: Option) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    dropdownClassName?: string;
    width?: "sm" | "md" | "full";
    creatable?: boolean;
    loading?: boolean;
    onChange?: (newValue: Option) => void;
}

/**
 * Select Component:
 * A customizable dropdown select component with search functionality
 * and option to create new items.
 *
 * @param options - List of options to display in the dropdown.
 * @param selectedOption - The currently selected value.
 * @param setSelectedOption - Callback function triggered when the selected value changes.
 * @param onChange - Optional callback function for handling changes to the selected option.
 * @param label - Optional label displayed above the input field.
 * @param placeholder - Placeholder text displayed when no value is selected.
 * @param className - Additional class name for the wrapper of the component.
 * @param inputClassName - Additional class name for the input field.
 * @param dropdownClassName - Additional class name for the dropdown menu.
 * @param width - Determines the width of the dropdown ('sm', 'md', 'full').
 * @param creatable - If true, allows the creation of new options.
 * @param loading - If true, displays a loading indicator in the dropdown menu.
 * @param ...props - Additional input props that will be passed to the underlying input element.
 */
const Select: FC<CustomSelectProps> = ({
    options,
    selectedOption,
    setSelectedOption,
    label,
    placeholder,
    className = "",
    inputClassName = "",
    dropdownClassName = "",
    width = "md",
    creatable = false,
    loading = false,
    onChange,
    "aria-label": ariaLabel,
    ...inputProps
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Generate unique IDs for accessibility
    const [generatedId, setGeneratedId] = React.useState("");

    React.useEffect(() => {
        setGeneratedId(`select-${v4()}`);
    }, []);

    const allOptions = options;
    const filteredOptions = allOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );

    const canCreateNewOption =
        creatable &&
        inputValue.trim() !== "" &&
        !allOptions.some(
            (option) => option.label.toLowerCase() === inputValue.toLowerCase(),
        );

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setFocusedIndex(-1);
                setInputValue("");
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const sizeClass =
        {
            sm: "w-64",
            md: "w-96",
            full: "w-full",
        }[width] || "w-96";

    const handleClearInputValue = () => {
        setInputValue("");
        setSelectedOption({
            label: "",
            value: "",
        });
        setFocusedIndex(-1);
        inputRef.current?.focus();
    };

    const handleToggleDropdown = () => {
        setInputValue("");
        setIsOpen((prev) => !prev);
        if (!isOpen) {
            inputRef.current?.focus();
        }
    };

    const handleSelect = (newValue: Option) => {
        setSelectedOption(newValue);
        if (onChange) onChange(newValue);
        setInputValue("");
        setIsOpen(false);
        setFocusedIndex(-1);
        inputRef.current?.focus();
    };

    const handleCreateNewOption = () => {
        if (inputValue.trim() !== "") {
            const newOption = {
                label: inputValue.trim(),
                value: inputValue.trim(),
            };
            setSelectedOption(newOption);
            if (onChange) onChange(newOption);
            setInputValue("");
            setIsOpen(false);
            setFocusedIndex(-1);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const filteredOptionsCount = filteredOptions.length;
        const creatableOptionIndex =
            creatable && canCreateNewOption ? filteredOptionsCount : -1;
        const totalOptions =
            filteredOptionsCount + (creatableOptionIndex !== -1 ? 1 : 0);

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setFocusedIndex((prev) => (prev + 1) % totalOptions);
                break;
            case "ArrowUp":
                event.preventDefault();
                setFocusedIndex(
                    (prev) => (prev - 1 + totalOptions) % totalOptions,
                );
                break;
            case "Enter":
                event.preventDefault();
                if (
                    isOpen &&
                    focusedIndex >= 0 &&
                    focusedIndex < filteredOptionsCount
                ) {
                    handleSelect(filteredOptions[focusedIndex]);
                } else if (
                    !loading &&
                    focusedIndex >= 0 &&
                    focusedIndex === creatableOptionIndex
                ) {
                    handleCreateNewOption();
                } else if (
                    !loading &&
                    canCreateNewOption &&
                    inputValue.trim() !== ""
                ) {
                    handleCreateNewOption();
                } else {
                    handleToggleDropdown();
                }
                break;
            case "Escape":
                setIsOpen(false);
                setInputValue("");
                setFocusedIndex(-1);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (focusedIndex >= 0) {
            const optionElement = document.getElementById(
                `${generatedId}-option-${focusedIndex}`,
            );
            if (optionElement) {
                optionElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }
    }, [focusedIndex, generatedId]);

    return (
        <div
            ref={dropdownRef}
            className={`group grid gap-1 ${sizeClass} ${className}`}
        >
            {label && (
                <label
                    htmlFor={generatedId}
                    className="mb-0 block text-xs font-medium text-gray-600"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <Input
                    {...inputProps}
                    ref={inputRef}
                    id={generatedId}
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsOpen(true);
                        setFocusedIndex(-1);
                    }}
                    width={width}
                    onClick={(e) => {
                        setInputValue("");
                        if (!dropdownRef.current?.contains(e.target as Node)) {
                            handleToggleDropdown();
                        }
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls={`${generatedId}-listbox`}
                    aria-activedescendant={
                        focusedIndex >= 0
                            ? `${generatedId}-option-${focusedIndex}`
                            : undefined
                    }
                    aria-label={ariaLabel || label || "Select an option"}
                    aria-autocomplete="list"
                    className={cn(
                        "pr-20",
                        selectedOption.value !== "" &&
                            "placeholder:text-gray-950",
                        inputClassName,
                    )}
                    placeholder={
                        selectedOption.label !== ""
                            ? selectedOption.label
                            : placeholder
                    }
                />
                <div className="absolute bottom-px right-0 top-px flex">
                    {selectedOption?.value !== "" && !loading && (
                        <Button
                            variant="ghost"
                            onClick={handleClearInputValue}
                            className="group h-full !px-2 !py-0 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 focus:!outline-1 focus:!-outline-offset-0 focus-visible:!outline-1"
                            aria-label="Clear selection"
                        >
                            <X
                                className="stroke-gray-600 group-hover:stroke-gray-800"
                                size={16}
                            />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="group h-full rounded-r-sm !px-2 !py-0 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 focus:!outline-1 focus:!-outline-offset-0 focus-visible:!outline-1"
                        aria-label={isOpen ? "Close dropdown" : "Open dropdown"}
                        aria-expanded={isOpen}
                    >
                        <ChevronDown
                            className={`transform stroke-gray-600 transition-transform group-hover:stroke-gray-800 ${
                                isOpen ? "rotate-180" : "rotate-0"
                            }`}
                            size={16}
                        />
                    </Button>
                </div>
            </div>
            {isOpen &&
                ReactDOM.createPortal(
                    <ul
                        style={{
                            position: "absolute",
                            zIndex: 1000,
                            top:
                                dropdownRef.current?.getBoundingClientRect()
                                    .bottom || 0,
                            left:
                                dropdownRef.current?.getBoundingClientRect()
                                    .left || 0,
                            width:
                                dropdownRef.current?.getBoundingClientRect()
                                    .width || "auto",
                        }}
                        id={`${generatedId}-listbox`}
                        role="listbox"
                        aria-label={`${label || "Options"} list`}
                        className={`select-dropdown absolute left-0 right-0 z-10 mt-2 max-h-40 overflow-auto rounded-sm border border-gray-300 bg-white text-sm shadow-md ${dropdownClassName}`}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {filteredOptions.map((option, index) => (
                            <li
                                id={`${generatedId}-option-${index}`}
                                role="option"
                                key={option.value}
                                aria-selected={
                                    option.value === selectedOption.value
                                }
                                className={`group cursor-pointer border-b border-b-gray-300 bg-gray-100 px-4 last:border-none hover:border-transparent hover:bg-gray-200 hover:outline-none hover:outline-2 hover:-outline-offset-2 hover:outline-primary active:bg-gray-300 ${option.value === selectedOption.value && "bg-gray-200 hover:bg-gray-300"} ${
                                    index === focusedIndex &&
                                    "bg-gray-300 outline-none outline-1 -outline-offset-1 outline-primary"
                                }`}
                                onClick={() => handleSelect(option)}
                                title={option.label}
                            >
                                <div className="flex w-full items-center justify-between gap-2 py-2 text-black/70 group-hover:text-black group-data-[selected=true]:border-transparent">
                                    <span>{option.label}</span>
                                    {option.value === selectedOption.value && (
                                        <Check
                                            size={16}
                                            className="stroke-gray-600"
                                        />
                                    )}
                                </div>
                            </li>
                        ))}
                        {canCreateNewOption && !loading && (
                            <li
                                id={`${generatedId}-option-${filteredOptions.length}`}
                                role="option"
                                aria-selected={false}
                                className={`group cursor-pointer truncate bg-gray-100 px-4 py-2 hover:bg-gray-200 hover:outline-none hover:outline-2 hover:-outline-offset-2 hover:outline-primary active:bg-gray-300 ${focusedIndex === filteredOptions.length && "bg-gray-300 outline-none outline-1 -outline-offset-1 outline-primary"} }`}
                                onClick={handleCreateNewOption}
                                title={`Create "${inputValue}"`}
                            >
                                <span>
                                    Create <strong>{inputValue}</strong>
                                </span>
                            </li>
                        )}
                    </ul>,
                    document.body,
                )}
        </div>
    );
};

export default Select;

"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import Button from "@/components/button";
import ReactDOM from "react-dom";
import Input from "@/components/input";
import { cn } from "@/lib/utils";

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
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
    CreateEditModal?: React.ComponentType<{
        onSave: (newOption: Option) => void;
        onClose: () => void;
        isOpen: boolean;
        nameInputValue: string;
    }>;
}

/**
 * Select Component:
 * A customizable dropdown select component with optional search functionality,
 * creation of new options, and a create/edit modal.
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
 * @param CreateEditModal - Optional component for handling the creation and editing of options.
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
    CreateEditModal: CreateEditModal,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // states for the create edit modal
    const [createEditOpen, setCreateEditOpen] = useState(false);

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
    };

    const handleToggleDropdown = () => {
        setInputValue("");
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (newValue: Option) => {
        setSelectedOption(newValue);
        if (onChange) onChange(newValue); // Call onChange if provided
        setInputValue("");
        setIsOpen(false);
        setFocusedIndex(-1);
    };

    const handleCreateNewOption = () => {
        if (inputValue.trim() !== "") {
            setSelectedOption({
                label: inputValue.trim(),
                value: inputValue.trim(),
            });
            if (onChange)
                onChange({
                    label: inputValue.trim(),
                    value: inputValue.trim(),
                });
            setInputValue("");
            setIsOpen(false);
            setFocusedIndex(-1);
        }
    };

    const handleSaveNewOption = (newOption: Option) => {
        handleSelect(newOption); // Automatically select the new option
    };

    const handleOpenCreateEditModal = () => {
        setIsOpen(false);
        setCreateEditOpen(true);
    };

    const handleCloseCreateEditModal = () => {
        setCreateEditOpen(false);
        setInputValue("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const filteredOptionsCount = filteredOptions.length;
        const creatableOptionIndex =
            creatable && canCreateNewOption ? filteredOptionsCount : -1;
        const createEditIndex =
            CreateEditModal && creatableOptionIndex !== -1
                ? creatableOptionIndex + 1
                : -1;
        const totalOptions =
            filteredOptionsCount +
            (creatableOptionIndex !== -1 ? 1 : 0) +
            (createEditIndex !== -1 ? 1 : 0);

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
                    focusedIndex >= 0 &&
                    focusedIndex === createEditIndex
                ) {
                    handleOpenCreateEditModal();
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
                `option-${focusedIndex}`,
            );
            if (optionElement) {
                optionElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }
    }, [focusedIndex]);

    return (
        <div
            ref={dropdownRef}
            className={`group grid gap-1 ${sizeClass} ${className}`}
        >
            {label && (
                <label
                    htmlFor="input-id"
                    className="mb-0 block text-xs font-medium text-gray-600"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <Input
                    id="input-id"
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
                    aria-expanded={isOpen}
                    aria-controls="select-dropdown"
                    aria-activedescendant={`option-${focusedIndex}`}
                    className={cn(
                        "pr-20",
                        selectedOption.value !== "" &&
                            "placeholder:text-gray-950",
                        inputClassName,
                    )}
                    placeholder={
                        selectedOption.label !== ""
                            ? selectedOption.label
                            : placeholder || "Search or type..."
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
                        aria-label="Toggle dropdown"
                        aria-expanded={isOpen ? "true" : "false"}
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
                        id="select-dropdown"
                        role="listbox"
                        aria-labelledby="input-id"
                        className={`select-dropdown absolute left-0 right-0 z-10 mt-2 max-h-40 overflow-auto border border-gray-300 bg-white text-sm shadow-md ${dropdownClassName}`}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {filteredOptions.map((option, index) => (
                            <li
                                id={`option-${index}`}
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
                                id={`option-${filteredOptions.length}`}
                                className={`group cursor-pointer truncate bg-gray-100 px-4 py-2 hover:bg-gray-200 hover:outline-none hover:outline-2 hover:-outline-offset-2 hover:outline-primary active:bg-gray-300 ${focusedIndex === filteredOptions.length && "bg-gray-300 outline-none outline-1 -outline-offset-1 outline-primary"} }`}
                                onClick={handleCreateNewOption}
                                title={inputValue}
                            >
                                <span>
                                    Create <strong>{inputValue}</strong>
                                </span>
                            </li>
                        )}
                        {CreateEditModal && (
                            <li
                                id={`option-create-edit`}
                                className={`group cursor-pointer truncate bg-gray-100 px-4 py-2 hover:bg-gray-200 hover:outline-none hover:outline-2 hover:-outline-offset-2 hover:outline-primary active:bg-gray-300 ${
                                    focusedIndex ===
                                        filteredOptions.length + 1 &&
                                    "bg-gray-300 outline-none outline-1 -outline-offset-1 outline-primary"
                                }`}
                                onClick={handleOpenCreateEditModal}
                            >
                                <span>Edit or Create New Option</span>
                            </li>
                        )}
                    </ul>,
                    document.body,
                )}
            {CreateEditModal && (
                <CreateEditModal
                    isOpen={createEditOpen}
                    onClose={handleCloseCreateEditModal}
                    onSave={handleSaveNewOption}
                    nameInputValue={inputValue}
                />
            )}
        </div>
    );
};

export default Select;

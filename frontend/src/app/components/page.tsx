"use client";

import React, { useState } from "react";
import Loader from "@/components/loader"; // Import the Loader component
import Input from "@/components/input"; // Import the Input component
import Button from "@/components/button"; // Import the Button component
import Select from "@/components/select"; // Import the Select component

export default function Home() {
    const [selectedOption, setSelectedOption] = useState({
        label: "",
        value: "",
    }); // Fixed initial state to match the structure used

    const options = [
        { label: "Option 1", value: "1" },
        { label: "Option 2", value: "2" },
        { label: "Option 3", value: "3" },
    ];

    return (
        <div className="flex flex-col items-center gap-4 p-8">
            {/* Page Title */}
            <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>

            {/* Loader Component */}
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-lg font-medium">Loader Component</h2>
                <Loader size="sm" label="Loading small..." />
                <Loader size="md" label="Loading medium..." />
                <Loader size="lg" label="Loading large..." />
            </div>

            {/* Input Component */}
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-lg font-medium">Input Component</h2>
                <Input
                    label="Small Input"
                    width="sm"
                    placeholder="Enter small text..."
                />
                <Input
                    label="Medium Input"
                    width="md"
                    placeholder="Enter medium text..."
                />
                <Input
                    label="Full Width Input"
                    width="full"
                    placeholder="Enter full-width text..."
                />
            </div>

            {/* Button Component */}
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-lg font-medium">Button Component</h2>
                <Button variant="primary" size="sm">
                    Small Primary
                </Button>
                <Button variant="secondary" size="md">
                    Medium Secondary
                </Button>
                <Button variant="destructive" size="lg">
                    Large Destructive
                </Button>
                <Button variant="outline" size="sm">
                    Outline Button
                </Button>
                <Button variant="ghost" size="md">
                    Ghost Button
                </Button>
            </div>

            {/* Select Component */}
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-lg font-medium">Select Component</h2>
                <Select
                    options={options}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    label="Select an Option"
                    placeholder="Choose an option..."
                    creatable
                    width="md"
                />
            </div>
        </div>
    );
}

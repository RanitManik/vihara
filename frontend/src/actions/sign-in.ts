import { SignInFormData } from "@/app/auth/sign-in/page";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function signIn(formData: SignInFormData) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(responseBody.message || "Registration failed");
    }
}

import { SignUpFormData } from "@/app/auth/sign-up/page";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function signUp(formData: SignUpFormData) {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(responseBody.message || "Registration failed");
    }
}

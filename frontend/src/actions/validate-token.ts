const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function validateToken() {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Token validation failed.");
    }

    return await response.json();
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function signOut() {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include",
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to Sign Out!");
    }
}

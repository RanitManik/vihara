const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export const apiClient = {
  post: async <T>(path: string, body: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    const responseBody = await response.text();
    return (responseBody ? JSON.parse(responseBody) : {}) as Promise<T>;
  },
  get: async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return response.json() as Promise<T>;
  },

  postMultipart: async <T>(path: string, formData: FormData): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return response.json() as Promise<T>;
  },
  putMultipart: async <T>(path: string, formData: FormData): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return response.json() as Promise<T>;
  },
};

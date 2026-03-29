const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

let csrfToken: string | null = null;

const getCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  const response = await fetch(`${API_BASE_URL}/api/csrf-token`, {
    credentials: "include",
  });
  if (response.ok) {
    const data = await response.json();
    csrfToken = data.csrfToken;
  }
  return csrfToken;
};

export const clearCsrfToken = () => {
  csrfToken = null;
};

export const apiClient = {
  post: async <T>(path: string, body: unknown): Promise<T> => {
    const token = await getCsrfToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token || "",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 403) {
        // CSRF token might have expired, clear it and retry once
        csrfToken = null;
        const newToken = await getCsrfToken();
        const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": newToken || "",
          },
          body: JSON.stringify(body),
          credentials: "include",
        });
        if (retryResponse.ok) {
          const retryBody = await retryResponse.text();
          return (retryBody ? JSON.parse(retryBody) : {}) as Promise<T>;
        }
      }

      const errorBody = await response.text();
      let errorMessage = "Something went wrong";
      try {
        const errorJson = JSON.parse(errorBody);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const responseBody = await response.text();
    return (responseBody ? JSON.parse(responseBody) : {}) as Promise<T>;
  },
  get: async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = "Something went wrong";
      try {
        const errorJson = JSON.parse(errorBody);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  },

  postMultipart: async <T>(path: string, formData: FormData): Promise<T> => {
    const token = await getCsrfToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": token || "",
      },
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = "Something went wrong";
      try {
        const errorJson = JSON.parse(errorBody);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  },
  putMultipart: async <T>(path: string, formData: FormData): Promise<T> => {
    const token = await getCsrfToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers: {
        "X-CSRF-Token": token || "",
      },
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = "Something went wrong";
      try {
        const errorJson = JSON.parse(errorBody);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  },
};

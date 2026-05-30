import { useAuth } from "@/contexts/auth-context";

const API_BASE_URL = "https://ernotes-api.onrender.com/api/v1";

//
export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const bodyData = { name, email, password };

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(bodyData),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  const data = await response.json();

  return data;
}

//
export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Failed to login");
  }

  const data = await response.json();
  return data;
}

export async function logoutUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  return response.json() || null;
}

export async function getUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/profiles/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user");
  }

  return response.json();
}

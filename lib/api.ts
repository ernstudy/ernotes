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

// js/handlers/authHandlers.js

const API_BASE_URL = "https://wedev-api.sky.pro/api/v2/ilya-zamnius";
const AUTH_API_URL = "https://wedev-api.sky.pro/api/user";

export const loginUser = async (login, password) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      body: JSON.stringify({
        login: login,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ошибка ответа сервера:", errorText);
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    localStorage.setItem("authToken", data.user.token);
    localStorage.setItem("userName", data.user.name);

    return data;
  } catch (error) {
    console.error("Ошибка входа:", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");

  return token ? { token, userName } : null;
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userName");
};

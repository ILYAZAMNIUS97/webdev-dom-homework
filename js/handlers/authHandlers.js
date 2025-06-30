export const loginUser = async (login, password) => {
  try {
    const response = await fetch("https://wedev-api.sky.pro/api/user/login", {
      method: "POST",
      body: JSON.stringify({
        login,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка авторизации");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка входа:", error);
    throw error;
  }
};

export const registerUser = async (login, name, password) => {
  try {
    const response = await fetch("https://wedev-api.sky.pro/api/user", {
      method: "POST",
      body: JSON.stringify({
        login,
        name,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка регистрации");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    throw error;
  }
};

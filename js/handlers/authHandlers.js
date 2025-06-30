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
      throw new Error(error.error || "Неверный логин или пароль");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    throw error;
  }
};

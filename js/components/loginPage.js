export const renderLoginPage = (onLogin) => {
  const html = `
    <div class="login-container">
      <h2>Вход</h2>
      <form class="login-form">
        <input type="text" class="login-input" placeholder="Логин" required />
        <input type="password" class="password-input" placeholder="Пароль" required />
        <button type="submit" class="login-button">Войти</button>
      </form>
    </div>
  `;

  // Добавляем обработчик после рендера
  setTimeout(() => {
    const form = document.querySelector(".login-form");
    const loginInput = document.querySelector(".login-input");
    const passwordInput = document.querySelector(".password-input");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        if (login && password) {
          onLogin(login, password);
        }
      });
    }
  }, 0);

  return html;
};

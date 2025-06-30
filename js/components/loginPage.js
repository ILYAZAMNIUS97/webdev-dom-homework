export const renderLoginPage = (onLogin) => {
  return `
    <div class="login-container">
      <h2>Вход</h2>
      <form class="login-form">
        <input type="text" class="login-input" placeholder="Логин" required />
        <input type="password" class="password-input" placeholder="Пароль" required />
        <button type="submit" class="login-button">Войти</button>
      </form>
    </div>
  `;
};

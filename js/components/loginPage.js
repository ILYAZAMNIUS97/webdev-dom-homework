import { escapeHtml } from "../utils/htmlEscape.js";

export const renderLoginPage = (onLogin, onRegister) => {
  return `
    <div class="login-container">
      <h2>Авторизация</h2>
      <form class="login-form">
        <input type="text" class="login-input" placeholder="Логин" required />
        <input type="password" class="password-input" placeholder="Пароль" required />
        <div class="auth-buttons">
          <button type="submit" class="login-button">Войти</button>
          <button type="button" class="register-button">Зарегистрироваться</button>
        </div>
      </form>
      <div class="auth-error"></div>
    </div>
  `;
};

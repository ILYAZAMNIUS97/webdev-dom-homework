import { fetchComments } from "./data/comments.js";
import { renderComments } from "./components/commentsRenderer.js";
import { renderLoginPage } from "./components/loginPage.js";
import { addFormHandlers } from "./handlers/formHandlers.js";
import { addLikeHandlers } from "./handlers/likeHandlers.js";
import { loginUser } from "./handlers/authHandlers.js";

class CommentsApp {
  constructor() {
    this.comments = [];
    this.user = null;
    this.token = localStorage.getItem("token") || null;
    this.isAuth = false;
    this.init();
  }

  async init() {
    await this.checkAuth();
    await this.loadComments();
    this.renderInitialView();
  }

  async checkAuth() {
    if (this.token) {
      try {
        // Простая проверка токена (без запроса к серверу для экономии времени)
        this.isAuth = true;
      } catch (e) {
        this.handleLogout();
      }
    }
  }

  async loadComments() {
    try {
      this.comments = await fetchComments(this.token);
    } catch (e) {
      console.error("Ошибка загрузки комментариев:", e);
    }
  }

  renderInitialView() {
    const container = document.querySelector(".container");
    container.innerHTML = `
      <ul class="comments"></ul>
      ${this.isAuth ? this.renderCommentForm() : this.renderAuthPrompt()}
    `;

    this.renderComments();
    this.setupAuthLinkHandler();
  }

  renderAuthPrompt() {
    return `
      <div class="auth-prompt">
        <a href="#" class="auth-link">Чтобы добавить комментарий, авторизуйтесь</a>
      </div>
    `;
  }

  renderCommentForm() {
    return `
      <div class="add-form">
        <input type="text" class="add-form-name" value="${this.user?.name || "Админ"}" readonly />
        <textarea class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
        <div class="add-form-row">
          <button class="add-form-button">Написать</button>
        </div>
      </div>
    `;
  }

  renderComments() {
    renderComments(
      this.comments,
      (index) => this.toggleLike(index),
      (index) => this.replyToComment(index)
    );
    addLikeHandlers((index) => this.toggleLike(index));
  }

  renderLoginPage() {
    const container = document.querySelector(".container");
    container.innerHTML = renderLoginPage((login, password) =>
      this.handleLogin(login, password)
    );
  }

  setupAuthLinkHandler() {
    document.querySelector(".auth-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.renderLoginPage();
    });
  }

  async handleLogin(login, password) {
    try {
      const data = await loginUser(login, password);
      this.user = { name: data.user.name };
      this.token = data.user.token;
      this.isAuth = true;
      localStorage.setItem("token", this.token);
      await this.loadComments();
      this.renderInitialView();
    } catch (error) {
      alert(error.message);
    }
  }

  // ... остальные методы (toggleLike, replyToComment и т.д.)
}

new CommentsApp();

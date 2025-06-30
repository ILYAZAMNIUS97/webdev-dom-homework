import { fetchComments } from "./data/comments.js";
import { renderComments } from "./components/commentsRenderer.js";
import { renderLoginPage } from "./components/loginPage.js";
import { addFormHandlers } from "./handlers/formHandlers.js";
import { addLikeHandlers } from "./handlers/likeHandlers.js";
import { loginUser, registerUser } from "./handlers/authHandlers.js";

class CommentsApp {
  constructor() {
    console.log("1. App constructor started");
    this.comments = [];
    this.user = null;
    this.token = localStorage.getItem("token") || null;
    this.isAuth = !!this.token;
    this.loadingMessageElement = null;

    if (!document.querySelector(".container")) {
      console.error("CRITICAL: .container element not found in DOM");
      return;
    }

    this.init().catch((error) => {
      console.error("Initialization failed:", error);
      this.showError(
        "Ошибка загрузки приложения. Пожалуйста, обновите страницу."
      );
    });
    console.log("2. App constructor finished");
  }

  async init() {
    console.log("3. Init started");
    try {
      await this.loadComments();
      this.render();
      console.log("4. Init completed successfully");
    } catch (error) {
      console.error("Initialization error:", error);
      throw error;
    }
  }

  async loadComments() {
    console.log("Loading comments, auth:", this.isAuth);
    this.showLoadingMessage();
    try {
      this.comments = await fetchComments(this.token);
      console.log(`Loaded ${this.comments.length} comments`);
    } finally {
      this.hideLoadingMessage();
    }
  }

  render() {
    console.log("Rendering with auth:", this.isAuth);
    const container = document.querySelector(".container");
    if (!container) return;

    if (this.isAuth) {
      container.innerHTML = `
        <ul class="comments"></ul>
        <div class="add-form">
          <input type="text" class="add-form-name" placeholder="Ваше имя" readonly />
          <textarea class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
          <div class="add-form-row">
            <button class="add-form-button">Написать</button>
            <button class="logout-button">Выйти</button>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <ul class="comments"></ul>
        ${renderLoginPage()}
        <div class="auth-prompt">
          <a href="#" class="auth-link">Чтобы добавить комментарий, авторизуйтесь</a>
        </div>
      `;
    }

    this.renderComments();
    this.setupEventHandlers();
  }

  renderComments() {
    if (!this.comments.length) return;

    renderComments(
      this.comments,
      (index) => this.toggleLike(index),
      (index) => this.replyToComment(index)
    );
    addLikeHandlers((index) => this.toggleLike(index));
  }

  setupEventHandlers() {
    // Обработчики для формы
    if (this.isAuth) {
      this.formControls = addFormHandlers(
        (newComment) => this.addComment(newComment),
        this.isAuth,
        this.user?.name
      );

      document
        .querySelector(".logout-button")
        ?.addEventListener("click", () => {
          this.handleLogout();
        });
    }

    // Обработчики для авторизации
    document.querySelector(".auth-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.render();
    });

    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const login = document.querySelector(".login-input").value;
        const password = document.querySelector(".password-input").value;
        this.handleLogin(login, password);
      });
    }
  }

  // Добавьте остальные методы (handleLogin, handleLogout и т.д.)
  async handleLogin(login, password) {
    try {
      const data = await loginUser(login, password);
      this.user = data.user;
      this.token = data.user.token;
      this.isAuth = true;
      localStorage.setItem("token", this.token);
      await this.loadComments();
      this.render();
    } catch (error) {
      this.showError(error.message);
    }
  }

  handleLogout() {
    this.user = null;
    this.token = null;
    this.isAuth = false;
    localStorage.removeItem("token");
    this.render();
  }

  addComment(comment) {
    this.comments.unshift(comment);
    this.renderComments();
  }

  toggleLike(index) {
    this.comments[index].isLiked = !this.comments[index].isLiked;
    this.comments[index].likes += this.comments[index].isLiked ? 1 : -1;
    this.renderComments();
  }

  replyToComment(index) {
    if (!this.isAuth) return;
    const comment = this.comments[index];
    document.querySelector(".add-form-text").value =
      `> ${comment.name}: ${comment.text}\n`;
  }

  showLoadingMessage() {
    const commentsList = document.querySelector(".comments");
    if (commentsList) {
      this.loadingMessageElement = document.createElement("div");
      this.loadingMessageElement.textContent = "Загрузка...";
      this.loadingMessageElement.style.color = "#fff";
      commentsList.appendChild(this.loadingMessageElement);
    }
  }

  hideLoadingMessage() {
    if (this.loadingMessageElement) {
      this.loadingMessageElement.remove();
    }
  }

  showError(message) {
    const container = document.querySelector(".container");
    if (container) {
      container.innerHTML = `
        <div class="error-message" style="color: #ff6b6b; padding: 20px;">
          ${message}
        </div>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CommentsApp();
});

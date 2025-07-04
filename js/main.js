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
    this.isAuth = !!this.token;

    // Для теста можно добавить начального пользователя
    if (this.token && !this.user) {
      this.user = { name: "Админ" };
    }

    this.init();
  }

  async init() {
    await this.loadComments();
    this.renderInitialView();
    this.setupAuthLinkHandler();
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
    if (!container) return;

    container.innerHTML = `
      <ul class="comments"></ul>
      ${this.isAuth ? this.renderCommentForm() : this.renderAuthPrompt()}
    `;

    this.renderComments();
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

    if (this.isAuth) {
      addFormHandlers(
        (newComment) => this.addComment(newComment),
        this.user?.name
      );
    }
  }

  renderLoginPage() {
    const container = document.querySelector(".container");
    container.innerHTML = renderLoginPage((login, password) =>
      this.handleLogin(login, password)
    );
  }

  setupAuthLinkHandler() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("auth-link")) {
        e.preventDefault();
        this.renderLoginPage();
      }
    });
  }

  async handleLogin(login, password) {
    try {
      const data = await loginUser(login, password);
      this.user = { name: data.user.name };
      this.token = data.user.token;
      this.isAuth = true;

      localStorage.setItem("token", this.token);
      localStorage.setItem("userName", this.user.name);

      await this.loadComments();
      this.renderInitialView();
    } catch (error) {
      alert(error.message);
      this.renderLoginPage();
    }
  }

  addComment(comment) {
    this.comments = [comment, ...this.comments];
    this.renderComments();
  }

  toggleLike(index) {
    this.comments[index].isLiked = !this.comments[index].isLiked;
    this.comments[index].likes += this.comments[index].isLiked ? 1 : -1;
    this.renderComments();
  }

  replyToComment(index) {
    if (!this.isAuth) return;
    const textarea = document.querySelector(".add-form-text");
    if (textarea) {
      textarea.value = `> ${this.comments[index].name}: ${this.comments[index].text}\n`;
      textarea.focus();
    }
  }
}

// Инициализация приложения
document.addEventListener("DOMContentLoaded", () => {
  new CommentsApp();
});

// js/main.js
import { fetchComments } from "./data/comments.js";
import { renderComments } from "./components/commentsRenderer.js";
import { addFormHandlers } from "./handlers/formHandlers.js";

class CommentsApp {
  constructor() {
    this.comments = [];
    this.formControls = null;
    this.init();
  }

  async init() {
    this.showLoadingMessage();

    try {
      this.comments = await fetchComments();
    } finally {
      this.hideLoadingMessage();
    }

    this.formControls = addFormHandlers((newComment) => {
      this.addComment(newComment);
    });

    this.render();
  }

  addComment(comment) {
    this.comments.push(comment);
    this.render();
  }

  toggleLike(index) {
    this.comments[index].isLiked = !this.comments[index].isLiked;
    this.comments[index].likes += this.comments[index].isLiked ? 1 : -1;
    this.render();
  }

  replyToComment(index) {
    const comment = this.comments[index];
    const replyText = `> ${comment.name}: ${comment.text}\n`;
    this.formControls.setCommentText(replyText);
  }

  render() {
    renderComments(
      this.comments,
      (index) => this.toggleLike(index),
      (index) => this.replyToComment(index)
    );
  }

  showLoadingMessage() {
    const commentsList = document.querySelector(".comments");
    const loadingMessage = document.createElement("div");
    loadingMessage.classList.add("initial-loading-message");
    loadingMessage.textContent = "Пожалуйста подождите,загружаю комментарии…";
    loadingMessage.style.fontSize = "24px";
    loadingMessage.style.color = "#ffffff";
    loadingMessage.style.marginTop = "40px";
    commentsList.innerHTML = "";
    commentsList.appendChild(loadingMessage);
  }

  hideLoadingMessage() {
    const loadingMessage = document.querySelector(".initial-loading-message");
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }
}

new CommentsApp();

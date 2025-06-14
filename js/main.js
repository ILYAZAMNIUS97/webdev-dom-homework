import { fetchComments } from "./data/comments.js";
import { renderComments } from "./components/commentsRenderer.js";
import { addFormHandlers } from "./handlers/formHandlers.js";
import { addLikeHandlers } from "./handlers/likeHandlers.js";

class CommentsApp {
  constructor() {
    this.comments = [];
    this.formControls = null;
    this.loadingMessageElement = null;
    this.init();
  }

  async init() {
    this.showLoadingMessage();

    try {
      this.comments = await fetchComments();
    } catch (e) {
      console.error("Не удалось загрузить комментарии", e);
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

    addLikeHandlers((index) => this.toggleLike(index));
  }

  showLoadingMessage() {
    const commentsList = document.querySelector(".comments");
    this.loadingMessageElement = document.createElement("div");
    this.loadingMessageElement.textContent =
      "Пожалуйста подождите, загружаю комментарии...";
    this.loadingMessageElement.style.fontSize = "24px";
    this.loadingMessageElement.style.color = "#ffffff";
    this.loadingMessageElement.style.marginTop = "40px";
    commentsList.innerHTML = "";
    commentsList.appendChild(this.loadingMessageElement);
  }

  hideLoadingMessage() {
    if (this.loadingMessageElement) {
      this.loadingMessageElement.remove();
      this.loadingMessageElement = null;
    }
  }
}

new CommentsApp();

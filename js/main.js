import { commentsData } from "./data/comments.js";
import { renderComments } from "./components/commentsRenderer.js";
import { addFormHandlers } from "./handlers/formHandlers.js";

class CommentsApp {
  constructor() {
    this.comments = [...commentsData];
    this.formControls = null;
    this.init();
  }

  init() {
    // Инициализируем обработчики формы
    this.formControls = addFormHandlers((newComment) => {
      this.addComment(newComment);
    });

    // Первоначальный рендер
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
    const replyText = `> ${comment.name}: ${comment.text}\n\n`;
    this.formControls.setCommentText(replyText);
  }

  render() {
    renderComments(
      this.comments,
      (index) => this.toggleLike(index),
      (index) => this.replyToComment(index)
    );
  }
}

// Запускаем приложение
new CommentsApp();

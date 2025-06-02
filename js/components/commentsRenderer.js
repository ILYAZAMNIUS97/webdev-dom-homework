import { escapeHtml } from "../utils/htmlEscape.js";
import { addLikeHandlers } from "../handlers/likeHandlers.js";
import { addReplyHandlers } from "../handlers/replyHandlers.js";

export const renderComments = (comments, onLike, onReply) => {
  const commentsList = document.querySelector(".comments");

  commentsList.innerHTML = comments
    .map(
      (comment) => `
    <li class="comment">
      <div class="comment-header">
        <div>${escapeHtml(comment.name)}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${escapeHtml(comment.text)}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button ${comment.isLiked ? "-active-like" : ""}" data-index="${comments.indexOf(comment)}"></button>
        </div>
      </div>
    </li>
  `
    )
    .join("");

  addLikeHandlers(onLike);
  addReplyHandlers(onReply);
};

import { delay } from "../utils/delay.js";

export const addLikeHandlers = (onLike) => {
  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const index = parseInt(event.target.dataset.index);

      const commentElement = event.target.closest(".comment");
      if (!commentElement) return;

      const likeButton = commentElement.querySelector(".like-button");

      if (likeButton.classList.contains("-loading-like")) return;

      likeButton.classList.add("-loading-like");

      await delay(1000);

      onLike(index);

      likeButton.classList.remove("-loading-like");
    });
  });
};

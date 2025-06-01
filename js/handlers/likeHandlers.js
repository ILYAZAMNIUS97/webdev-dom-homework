export const addLikeHandlers = (onLike) => {
  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = parseInt(event.target.dataset.index);
      onLike(index);
    });
  });
};

export const addReplyHandlers = (onReply) => {
  document.querySelectorAll(".comment").forEach((comment) => {
    comment.addEventListener("click", (event) => {
      const index = parseInt(
        event.currentTarget.querySelector(".like-button").dataset.index
      );
      onReply(index);
    });
  });
};

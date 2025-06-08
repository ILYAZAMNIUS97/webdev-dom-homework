import { getCurrentDateTime } from "../utils/dateTime.js";

export const addFormHandlers = (onSubmit) => {
  const nameInput = document.querySelector(".add-form-name");
  const commentTextarea = document.querySelector(".add-form-text");
  const addButton = document.querySelector(".add-form-button");

  let userName = "";
  let commentText = "";

  nameInput.addEventListener("input", () => {
    userName = nameInput.value;
  });

  commentTextarea.addEventListener("input", () => {
    commentText = commentTextarea.value;
  });

  addButton.addEventListener("click", async () => {
    if (userName.trim().length < 3 || commentText.trim().length < 3) {
      alert("Имя и текст должны быть не короче 3 символов");
      return;
    }

    const dateTime = getCurrentDateTime();

    try {
      const response = await fetch(
        "https://wedev-api.sky.pro/api/v1/ilya-zamnius/comments",
        {
          method: "POST",
          body: JSON.stringify({
            name: userName,
            text: commentText,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Не удалось отправить комментарий");
        return;
      }

      onSubmit({
        name: userName,
        date: dateTime,
        text: commentText,
        likes: 0,
        isLiked: false,
      });

      nameInput.value = "";
      commentTextarea.value = "";
      userName = "";
      commentText = "";
    } catch (error) {
      alert("Произошла ошибка при отправке запроса");
    }
  });

  return {
    setCommentText: (text) => {
      commentTextarea.value = text;
      commentText = text;
    },
  };
};

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

  addButton.addEventListener("click", () => {
    if (userName.trim() === "" || commentText.trim() === "") {
      alert("Пожалуйста, введите имя и текст комментария");
      return;
    }

    const dateTime = getCurrentDateTime();

    onSubmit({
      name: userName,
      date: dateTime,
      text: commentText,
      likes: 0,
      isLiked: false,
    });

    // Очищаем форму
    nameInput.value = "";
    commentTextarea.value = "";
    userName = "";
    commentText = "";
  });

  // Возвращаем функцию для установки текста в textarea
  return {
    setCommentText: (text) => {
      commentTextarea.value = text;
      commentText = text;
    },
  };
};

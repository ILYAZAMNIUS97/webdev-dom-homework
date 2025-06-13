// js/handlers/formHandlers.js
import { getCurrentDateTime } from "../utils/dateTime.js";

export const addFormHandlers = (onSubmit) => {
  const formContainer = document.querySelector(".add-form");
  const addButton = document.querySelector(".add-form-button");
  const nameInput = document.querySelector(".add-form-name");
  const commentTextarea = document.querySelector(".add-form-text");

  let userName = "";
  let commentText = "";

  nameInput.addEventListener("input", () => {
    userName = nameInput.value;
  });

  commentTextarea.addEventListener("input", () => {
    commentText = commentTextarea.value;
  });

  const showLoadingMessage = () => {
    formContainer.style.display = "none";
    const loadingMessage = document.createElement("div");
    loadingMessage.classList.add("loading-message");
    loadingMessage.textContent = "Комментарий добавляется...";
    loadingMessage.style.fontSize = "18px";
    loadingMessage.style.marginTop = "20px";
    loadingMessage.style.color = "#ffffff";
    formContainer.parentNode.appendChild(loadingMessage);
  };

  const hideLoadingMessage = () => {
    const loadingMessage = document.querySelector(".loading-message");
    if (loadingMessage) {
      loadingMessage.remove();
    }
    formContainer.style.display = "";
  };

  addButton.addEventListener("click", async () => {
    if (userName.trim().length < 3 || commentText.trim().length < 3) {
      alert("Имя и текст должны быть не короче 3 символов");
      return;
    }

    showLoadingMessage();

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
        const errorData = await response.json().catch(() => null);
        console.error(
          "Ошибка от сервера:",
          errorData?.error || "Неизвестная ошибка"
        );

        hideLoadingMessage();
        return;
      }

      const result = await response.json();
      if (result.result === "ok") {
        const newComment = {
          name: userName,
          date: getCurrentDateTime(),
          text: commentText,
          likes: 0,
          isLiked: false,
        };
        onSubmit(newComment);
        nameInput.value = "";
        commentTextarea.value = "";
        userName = "";
        commentText = "";
      } else {
        console.error("Неожиданный ответ от сервера", result);
      }
    } catch (error) {
      console.error("Ошибка сети или сериализации:", error);
    } finally {
      hideLoadingMessage();
    }
  });

  return {
    setCommentText: (text) => {
      commentTextarea.value = text;
      commentText = text;
    },
  };
};

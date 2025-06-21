import { getCurrentDateTime } from "../utils/dateTime.js";

export const addFormHandlers = (onSubmit) => {
  const formContainer = document.querySelector(".add-form");
  const nameInput = document.querySelector(".add-form-name");
  const commentTextarea = document.querySelector(".add-form-text");
  const addButton = document.querySelector(".add-form-button");

  let userName = "";
  let commentText = "";

  // Восстанавливаем из localStorage или из переменных
  nameInput.value = localStorage.getItem("userName") || "";
  commentTextarea.value = localStorage.getItem("commentText") || "";

  nameInput.addEventListener("input", () => {
    userName = nameInput.value;
    localStorage.setItem("userName", userName);
  });

  commentTextarea.addEventListener("input", () => {
    commentText = commentTextarea.value;
    localStorage.setItem("commentText", commentText);
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
      alert("Имя и комментарий должны быть не короче 3 символов");
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
            //forceError: true,//
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          alert(
            errorData.error ||
              "Имя и комментарий должны быть не короче 3 символов"
          );
        } else if (response.status === 500) {
          alert("Сервер сломался, попробуй позже");
        }
        return;
      }

      const result = await response.json();
      if (result.result === "ok") {
        onSubmit({
          name: userName,
          date: getCurrentDateTime(),
          text: commentText,
          likes: 0,
          isLiked: false,
        });

        // Очищаем поля только после успешной отправки
        nameInput.value = "";
        commentTextarea.value = "";
        userName = "";
        commentText = "";
        localStorage.removeItem("userName");
        localStorage.removeItem("commentText");
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert("Кажется, у вас сломался интернет, попробуйте позже");
    } finally {
      hideLoadingMessage();
    }
  });

  return {
    setCommentText: (text) => {
      commentTextarea.value = text;
      commentText = text;
      localStorage.setItem("commentText", commentText);
    },
  };
};

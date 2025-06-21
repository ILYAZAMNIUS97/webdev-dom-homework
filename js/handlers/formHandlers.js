import { getCurrentDateTime } from "../utils/dateTime.js";

// Функция отправки комментария с возможностью повтора
const postComment = async (name, text) => {
  const MAX_RETRIES = 3;
  let retries = 0;

  while (retries <= MAX_RETRIES) {
    try {
      const response = await fetch(
        "https://wedev-api.sky.pro/api/v1/ilya-zamnius/comments",
        {
          method: "POST",
          body: JSON.stringify({ name, text, forceError: true }),
        }
      );

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error("Ошибка сервера");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Неизвестная ошибка");
        }
      }

      return await response.json(); // Успешный ответ
    } catch (error) {
      retries++;

      if (error.message === "Ошибка сервера" && retries <= MAX_RETRIES) {
        console.log(`Попытка ${retries} из ${MAX_RETRIES}...`);
        continue; // Повторяем запрос
      }

      throw error; // Пробрасываем дальше другие ошибки
    }
  }
};

export const addFormHandlers = (onSubmit) => {
  const formContainer = document.querySelector(".add-form");
  const nameInput = document.querySelector(".add-form-name");
  const commentTextarea = document.querySelector(".add-form-text");
  const addButton = document.querySelector(".add-form-button");

  let userName = "";
  let commentText = "";

  // Восстанавливаем из localStorage
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

  const handlePostClick = async () => {
    if (userName.trim().length < 3 || commentText.trim().length < 3) {
      alert("Имя и комментарий должны быть не короче 3 символов");
      return;
    }

    showLoadingMessage();

    try {
      await postComment(userName, commentText);

      onSubmit({
        name: userName,
        date: getCurrentDateTime(),
        text: commentText,
        likes: 0,
        isLiked: false,
      });

      // Очищаем форму после успешной отправки
      nameInput.value = "";
      commentTextarea.value = "";
      userName = "";
      commentText = "";
      localStorage.removeItem("userName");
      localStorage.removeItem("commentText");
    } catch (error) {
      if (error.message === "Ошибка сервера") {
        alert("Сервер сломался. Попробуйте ещё раз позже.");
      } else if (error.message.includes("Failed to fetch")) {
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      } else {
        alert(error.message);
      }
    } finally {
      hideLoadingMessage();
    }
  };

  addButton.addEventListener("click", handlePostClick);

  return {
    setCommentText: (text) => {
      commentTextarea.value = text;
      commentText = text;
      localStorage.setItem("commentText", commentText);
    },
  };
};

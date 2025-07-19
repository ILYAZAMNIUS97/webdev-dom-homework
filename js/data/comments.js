export const fetchComments = async (token = null) => {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      "https://wedev-api.sky.pro/api/v2/ilya-zamnius/comments",
      {
        headers,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка загрузки комментариев");
    }

    const data = await response.json();
    return data.comments.map((comment) => ({
      id: comment.id,
      name: comment.author.name,
      date: new Date(comment.date).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: comment.text,
      likes: comment.likes,
      isLiked: comment.isLiked || false,
      author: comment.author,
    }));
  } catch (error) {
    console.error("Не удалось загрузить комментарии:", error);
    throw error;
  }
};

export const postComment = async ({ text, token }) => {
  try {
    const response = await fetch(
      "https://wedev-api.sky.pro/api/v2/ilya-zamnius/comments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка при отправке комментария");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error);
    throw error;
  }
};

export const toggleLike = async ({ commentId, token }) => {
  try {
    const response = await fetch(
      `https://wedev-api.sky.pro/api/v2/ilya-zamnius/comments/${commentId}/toggle-like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка при изменении лайка");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при лайке комментария:", error);
    throw error;
  }
};

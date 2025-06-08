export const fetchComments = async () => {
  const response = await fetch(
    "https://wedev-api.sky.pro/api/v1/ilya-zamnius/comments"
  );
  if (!response.ok) {
    throw new Error("Ошибка загрузки комментариев");
  }
  const data = await response.json();
  return data.comments.map((comment) => ({
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
  }));
};

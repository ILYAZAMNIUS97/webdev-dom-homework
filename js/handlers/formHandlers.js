export const addFormHandlers = (onSubmit, userName) => {
  const nameInput = document.querySelector(".add-form-name");
  const textInput = document.querySelector(".add-form-text");
  const submitButton = document.querySelector(".add-form-button");

  nameInput.value = userName;
  nameInput.readOnly = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = textInput.value.trim();
    if (!text) return;

    onSubmit({
      name: userName,
      text: text,
      date: new Date().toLocaleString(),
      likes: 0,
      isLiked: false,
    });

    textInput.value = "";
  };

  submitButton.addEventListener("click", handleSubmit);
};
